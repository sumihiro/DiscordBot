exports.commands = [
    "pacman",
	"pac",
	"jpy",
    "rate",
]

const numeral = require('numeral');

// キャッシュを保持する時間(msec)
let cacheExpire = 60000;
// キャッシュの更新中フラグ
let isCacheUpdating = false;
// キャッシュの更新完了を確認する間隔(msec)
let waitmsec = 1000;

const config = require('./config.json');
let exchanges = [];
config.exchanges.forEach(exchange => {
    const ex = require('./' + exchange).class
    exchanges.push(new ex())
})

let cache = {
    'expire': 0,
    'results': [],
};

function isAllowedCannel(msg) {
    const server = msg.guild.id;
    const channel = msg.channel.id

    let redirect = null;
    for (const key in config.servers) {
        if (config.servers.hasOwnProperty(key)) {
            const server = config.servers[key];
            server.disallowed.forEach(element => {
                if (channel == element) {
                    redirect = server.redirect;
                }
            });
        }
    }

    return redirect;
}

async function updateCahe(beginCallback) {
    const now = Date.now();
    if (now < cache.expire) {
        // console.log('use cache');
        return cache;
    } else {
        // console.log('update cache');
        beginCallback();

        // 他のコールでキャッシュを更新中の場合は
        // その更新が終わるまで待つ
        if (isCacheUpdating) {
            while(isCacheUpdating) {
                await wait(waitmsec);
            }
        } else {
            // キャッシュを更新する
            isCacheUpdating = true;

            try {
                let updates = []
                exchanges.forEach(exchange => {
                    updates.push(exchange.update())
                })
                const results = await Promise.all(updates)
                
                cache.results = results;
                cache.expire = Date.now() + cacheExpire;
        
                isCacheUpdating = false;
            } catch(e) {
                isCacheUpdating = false;
                throw e;
            };
        }
    }
}

function wait(msec) {
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    })
}

/**
 * handler
 */
function handle(bot,msg,suffix,handler,useCache = true) {
    const redirect = isAllowedCannel(msg)
    if (redirect !== null){
        msg.reply('botはここにはいません。 <#' + redirect + '> で待っています。');
        return;
    }
     
    if (useCache) {
        updateCahe(() => {
            msg.reply('計算中...');
        }).then(() => {
            handler(bot,msg,suffix);
        }).catch(e => {
            console.error(e);
            msg.reply(config.message.update_error);
        });
    } else {
        handler(bot,msg,suffix);
    }
}

function handleRate(bot,msg,suffix) {
    const lines = [' `1 USDT = ' + config.fiat_rate + ' ' + config.fiat + '`'];
    cache.results.forEach(exchange => {
        if (exchange.hasError) {
            lines.push('**' + exchange.exchange + ':**')
            lines.push('```')
            lines.push(config.message.update_error)
            lines.push('```')
        } else {
            lines.push('**' + exchange.exchange
             + ':** `' + numeral(exchange.fiat_average * config.fiat_rate).format('0,0.00000000')
             + ' ' + config.fiat + '/' + config.coin + '`')
            lines.push('```')
            exchange.coins.forEach(coin => {
                lines.push(coin.rate.toFixed(8) + ' ' + coin.coin.padEnd(5) +'/' + config.coin 
                + ', ' + numeral(coin.fiat_rate * config.fiat_rate).format('0,0.00000000') + ' ' + config.fiat + '/' + config.coin)
            });
            lines.push('```')
        }
    });

    embedDonateMessage(lines)
    msg.reply(lines.join("\n"));
}

function handlePAC(bot,msg,suffix) {
    const amount = suffix;

    const lines = [' `1 USDT = ' + config.fiat_rate + ' ' + config.fiat + '`']
    lines.push(numeral(amount).format('0,0') + ' $PAC は円建てで以下の価値があります。')
    cache.results.forEach(exchange => {
        if (exchange.hasError) {
            lines.push('**' + exchange.exchange + ':**')
            lines.push('```')
            lines.push(config.message.update_error)
            lines.push('```')
        } else {
            lines.push('**' + exchange.exchange
             + ':** `' + numeral(amount * exchange.fiat_average * config.fiat_rate).format('0,0')
             + ' ' + config.fiat + '`')
            lines.push('```')
            exchange.coins.forEach(coin => {
                lines.push(coin.coin.padStart(5) + ': ' + numeral(amount * coin.fiat_rate * config.fiat_rate).format('0,0') + ' ' + config.fiat 
                + ' (' + coin.rate.toFixed(8) + ' ' + coin.coin +'/' + config.coin + ')')
            });
            lines.push('```')
        }
    });

    embedDonateMessage(lines)
    msg.reply(lines.join("\n"));
}

function handleJPY(bot,msg,suffix) {
    const amount = suffix;

    const lines = [' `1 USDT = ' + config.fiat_rate + ' ' + config.fiat + '`']
    lines.push(numeral(amount).format('0,0') + '円で次の量の' + config.coin + 'が購入できます。')
    cache.results.forEach(exchange => {
        if (exchange.hasError) {
            lines.push('**' + exchange.exchange + ':**')
            lines.push('```')
            lines.push(config.message.update_error)
            lines.push('```')
        } else {
            lines.push('**' + exchange.exchange
             + ':** `' + numeral(amount / (exchange.fiat_average * config.fiat_rate)).format('0,0')
             + ' ' + config.coin + '`')
            lines.push('```')
            exchange.coins.forEach(coin => {
                lines.push(coin.coin.padStart(5) + ': ' + numeral(amount / (coin.fiat_rate * config.fiat_rate)).format('0,0') + ' ' + config.coin 
                + ' (' + coin.rate.toFixed(8) + ' ' + coin.coin +'/' + config.coin + ')')
            });
            lines.push('```')
        }
    });

    embedDonateMessage(lines)
    msg.reply(lines.join("\n"))
}

function embedDonateMessage(lines) {
    if (config.donate && config.donate.message) {
        lines.push(config.donate.message)
    }
}

/**
 * exports
 */
exports.pacman = {
	usage: "",
	process: function(bot,msg,suffix) {
        if (!isAllowedCannel(msg)) return;
        msg.reply('今、ここに' + numeral(msg.channel.guild.memberCount).format('0,0') + '人のPACMANがいます！');
	}
}

exports.rate = {
	usage: "",
	process: function(bot,msg,suffix) {
        handle(bot,msg,suffix,handleRate);
	}
}

exports.pac = {
	usage: "<amount of $PAC>",
	process: function(bot,msg,suffix) {
        handle(bot,msg,suffix,handlePAC);
	}
}

exports.jpy = {
	usage: "<amount of JPY>",
	process: function(bot,msg,suffix) {
        handle(bot,msg,suffix,handleJPY);
	}
}

