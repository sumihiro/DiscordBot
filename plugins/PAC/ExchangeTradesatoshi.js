const Exchange = require('./Exchange').Exchange;

class ExchangeTradesatoshi extends Exchange {
    constructor() {
        super();

        this.title = 'Tradesatoshi'
    }

    async update() {
        try {
            const apis = [
                '/api/public/getticker?market=BTC_USDT',
                '/api/public/getticker?market=$PAC_BTC',

                '/api/public/getticker?market=DOGE_USDT',
                '/api/public/getticker?market=$PAC_DOGE',
                
                '/api/public/getticker?market=LTC_USDT',
                '/api/public/getticker?market=$PAC_LTC',

                '/api/public/getticker?market=BCH_USDT',
                '/api/public/getticker?market=$PAC_BCH',

                '/api/public/getticker?market=$PAC_USDT',
            ]
    
            const [
                btc_usd_data, pac_btc_data,
                doge_usd_data, pac_doge_data,
                ltc_usd_data, pac_ltc_data,
                bch_usd_data, pac_bch_data,
                pac_usd_data, 
            ] = await this.para('GET', 'tradesatoshi.com', apis)
        
            this.coins = []
    
            this.coins.push({
                exchange: this.title,
                coin: 'BTC',
                fiat: 'USDT',
                rate: pac_btc_data.result.last,
                fiat_rate: btc_usd_data.result.last * pac_btc_data.result.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'BCH',
                fiat: 'USDT',
                rate: pac_bch_data.result.last,
                fiat_rate: bch_usd_data.result.last * pac_bch_data.result.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'DOGE',
                fiat: 'USDT',
                rate: pac_doge_data.result.last,
                fiat_rate: doge_usd_data.result.last * pac_doge_data.result.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'LTC',
                fiat: 'USDT',
                rate: pac_ltc_data.result.last,
                fiat_rate: ltc_usd_data.result.last * pac_ltc_data.result.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'USDT',
                fiat: 'USDT',
                rate: pac_usd_data.result.last,
                fiat_rate: pac_usd_data.result.last
            })

            
            this.hasError = false
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchangeTradesatoshi
