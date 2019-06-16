const Exchange = require('./Exchange').Exchange;

class ExchangeGraviex extends Exchange {
    constructor() {
        super();

        this.title = 'Graviex'
    }

    async update() {
        try {
            const apis = [
                '/api/v3/tickers/btcusd.json',
                '/api/v3/tickers/pacbtc.json',
                '/api/v3/tickers/ethusd.json',
                '/api/v3/tickers/paceth.json',
                '/api/v3/tickers/ltcusd.json',
                '/api/v3/tickers/pacltc.json',
                '/api/v3/tickers/dogeusd.json',
                '/api/v3/tickers/pacdoge.json'
            ]

            const [
                btc_usd_data, pac_btc_data,
                eth_usd_data, pac_eth_data,
                ltc_usd_data, pac_ltc_data,
                doge_usd_data, pac_doge_data
            ] = await this.para('GET', 'graviex.net', apis)

            this.coins = []

            this.coins.push({
                exchange: this.title,
                coin: 'BTC',
                fiat: 'USD',
                rate:　parseFloat(pac_btc_data.last),
                fiat_rate: parseFloat(pac_btc_data.last) * parseFloat(btc_usd_data.last)
            })
            this.coins.push({
                exchange: this.title,
                coin: 'ETH',
                fiat: 'USD',
                rate: parseFloat(pac_eth_data.last),
                fiat_rate: parseFloat(pac_eth_data.last) * parseFloat(eth_usd_data.last)
            })
            this.coins.push({
                exchange: this.title,
                coin: 'LTC',
                fiat: 'USD',
                rate: parseFloat(pac_ltc_data.last),
                fiat_rate: parseFloat(pac_ltc_data.last) * parseFloat(ltc_usd_data.last)
            })
            this.coins.push({
                exchange: this.title,
                coin: 'DOGE',
                fiat: 'USD',
                rate: parseFloat(pac_doge_data.last),
                fiat_rate: parseFloat(pac_doge_data.last) * parseFloat(doge_usd_data.last)
            })
            this.hasError = false
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchangeGraviex
