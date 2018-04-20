const Exchange = require('./Exchange').Exchange;

class ExchageCrex24 extends Exchange {
    constructor() {
        super();

        this.title = 'CREX24'
    }

    async update() {
        try {
            const data = await this.request('GET', 'api.crex24.com', '/CryptoExchangeService/BotPublic/ReturnTicker')
            if (data.Error == null) {
                let pac_btc, btc_usd
                data.Tickers.forEach(element => {
                    if (element.PairName == 'USD_BTC') {
                        btc_usd = element.Last
                    } else if (element.PairName == 'BTC_$PAC') {
                        pac_btc = element.Last
                    }
                });
                this.coins = []
    
                this.coins.push({
                    exchange: this.title,
                    coin: 'BTC',
                    fiat: 'USDT',
                    rate: pac_btc,
                    fiat_rate: pac_btc * btc_usd
                })
                this.hasError = false
            } else {
                this.hasError = true
            }
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchageCrex24
