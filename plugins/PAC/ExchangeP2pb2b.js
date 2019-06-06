const Exchange = require('./Exchange').Exchange;

class ExchangeP2pb2b extends Exchange {
    constructor() {
        super();

        this.title = 'P2pb2b'
    }

    async update() {
        try {
            const apis = [
                '/api/v1/public/ticker?market=BTC_USD',
                '/api/v1/public/ticker?market=PAC_BTC',
                '/api/v1/public/ticker?market=ETH_USD',
                '/api/v1/public/ticker?market=PAC_ETH',
                '/api/v1/public/ticker?market=PAC_USD',
            ]

            const [
                btc_usd_data,
                pac_btc_data,
                eth_usd_data,
                pac_eth_data,
                pac_usd_data,
            ] = await this.para('GET', 'api.p2pb2b.io', apis)

            this.coins = []

            this.coins.push({
                exchange: this.title,
                coin: 'BTC',
                fiat: 'USD',
                rate:　parseFloat(pac_btc_data.result.last),
                fiat_rate: parseFloat(pac_btc_data.result.last) * parseFloat(btc_usd_data.result.last)
            })
            this.coins.push({
                exchange: this.title,
                coin: 'ETH',
                fiat: 'USD',
                rate: parseFloat(pac_eth_data.result.last),
                fiat_rate: parseFloat(pac_eth_data.result.last) * parseFloat(eth_usd_data.result.last)
            })
            this.coins.push({
                exchange: this.title,
                coin: 'USD',
                fiat: 'USD',
                rate: parseFloat(pac_usd_data.result.last),
                fiat_rate: parseFloat(pac_usd_data.result.last)
            })
            this.hasError = false
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchangeP2pb2b
