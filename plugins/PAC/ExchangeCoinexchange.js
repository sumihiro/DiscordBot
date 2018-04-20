const Exchange = require('./Exchange').Exchange;

class ExchangeCoinexchange extends Exchange {
    constructor() {
        super();

        this.title = 'CoinExchange'
    }

    async update() {
        try {
            const apis = [
                '/api/v1/getmarketsummary?market_id=789', // PAC_BTC
                '/api/v1/getmarketsummary?market_id=790', // PAC_LTC
            ]
    
            const [
                pac_btc_data,
                pac_ltc_data,
            ] = await this.para('GET', 'www.coinexchange.io', apis)

            const cmapis = [
                '/v1/ticker/bitcoin/',
                '/v1/ticker/litecoin/',
            ]
    
            const [
                btc_data,
                ltc_data,
            ] = await this.para('GET', 'api.coinmarketcap.com', cmapis)

            this.coins = []
    
            this.coins.push({
                exchange: this.title,
                coin: 'BTC',
                fiat: 'USDT',
                rate: 1 * pac_btc_data.result.LastPrice,
                fiat_rate: 1 * pac_btc_data.result.LastPrice * btc_data[0].price_usd
            })
            this.coins.push({
                exchange: this.title,
                coin: 'LTC',
                fiat: 'USDT',
                rate: 1 * pac_ltc_data.result.LastPrice,
                fiat_rate: 1 * pac_ltc_data.result.LastPrice * ltc_data[0].price_usd
            })
            
            this.hasError = false
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchangeCoinexchange
