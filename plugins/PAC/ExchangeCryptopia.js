const Exchange = require('./Exchange').Exchange;

class ExchageCryptopia extends Exchange {
    constructor() {
        super();

        this.title = 'Cryptopia'
    }

    async update() {
        try {
            const data = await this.request('GET', 'www.cryptopia.co.nz', '/api/GetMarkets')
            if (data.Success) {
                let pac_btc, pac_ltc, pac_doge, pac_usdt
                let btc_usdt, ltc_usdt, doge_usdt
    
                data.Data.forEach(coin => {
                    if (coin.Label == '$PAC/BTC') {
                        pac_btc = coin.LastPrice
                    } else if (coin.Label == '$PAC/LTC') {
                        pac_ltc = coin.LastPrice
                    } else if (coin.Label == '$PAC/DOGE') {
                        pac_doge = coin.LastPrice
                    } else if (coin.Label == '$PAC/USDT') {
                        pac_usdt = coin.LastPrice
                    } else if (coin.Label == 'BTC/USDT') {
                        btc_usdt = coin.LastPrice
                    } else if (coin.Label == 'LTC/USDT') {
                        ltc_usdt = coin.LastPrice
                    } else if (coin.Label == 'DOGE/USDT') {
                        doge_usdt = coin.LastPrice
                    }
                });
    
                this.coins = []
    
                this.coins.push({
                    exchange: this.title,
                    coin: 'BTC',
                    fiat: 'USDT',
                    rate: pac_btc, 
                    fiat_rate: pac_btc * btc_usdt 
                })
                this.coins.push({
                    exchange: this.title,
                    coin: 'LTC',
                    fiat: 'USDT',
                    rate: pac_ltc, 
                    fiat_rate: pac_ltc * ltc_usdt 
                })
                this.coins.push({
                    exchange: this.title,
                    coin: 'DOGE',
                    fiat: 'USDT',
                    rate: pac_doge, 
                    fiat_rate: pac_doge * doge_usdt 
                })
                this.coins.push({
                    exchange: this.title,
                    coin: 'USDT',
                    fiat: 'USDT',
                    rate: pac_usdt,
                    fiat_rate: pac_usdt 
                })
    
                this.hasError = false
            } else {
                this.coins = []
                this.hasError = true
            }
        } catch (error) {
            this.coins = []
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchageCryptopia
