const https = require('https')
const promiseLimit = require('promise-limit')
const limit = promiseLimit(2)

class Exchange {
    constructor() {
        this.title = 'unknown'
        this.coins = []
        this.hasError = false;
    }

    rates() {
        let fiat_average = 0;
        if (this.coins.length > 0) {
            this.coins.forEach(coin => {
                fiat_average += (coin.fiat_rate / this.coins.length)
            })
        }
        return {
            exchange: this.title,
            coins: this.coins,
            fiat_average: fiat_average,
            hasError: this.hasError,
        }
    }

    async update() {
        return this.rates();
    }

    async para(method, host, paths) {
        const results = await Promise.all(paths.map((path) => {
            return limit(() => this.request(method, host, path))
        }))
        return results
    }

    request(method, host, path, callback) {
        return new Promise((resolve, reject) => {
            const options = {
                host: host,
                path: path,
                verbose: false,
                headers: {
                    // 'User-Agent': this.userAgent
                }
            }
            const cb = (response) => {
                let str = ''
                response.on('data', (chunk) => {
                    str += chunk
                    if (options.verbose) console.log(str)
                })
                response.on('end', () => {
                    let objFromJSON
                    try {
                        // console.log(path + str);
                        objFromJSON = JSON.parse(str)
                        return resolve(objFromJSON)
                    } catch (err) {
                        console.error(path + str)
                        return reject(err)
                    }
                })
            }
            const req = https.request(options, cb)
            req.on('error', (err) => {
                reject(err)
            })
            req.end()
        });
    };
}

exports.Exchange = Exchange
