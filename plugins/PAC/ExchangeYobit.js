const Exchange = require('./Exchange').Exchange;

class ExchageYoBit extends Exchange {
    constructor() {
        super();

        this.title = 'YoBit'
    }

    async update() {
        try {
            const apis = [
                '/api/3/ticker/btc_usd',
                '/api/3/ticker/pac_btc',
                '/api/3/ticker/eth_usd',
                '/api/3/ticker/pac_eth',
                '/api/3/ticker/doge_usd',
                '/api/3/ticker/pac_doge',
                '/api/3/ticker/waves_usd',
                '/api/3/ticker/pac_waves',
                '/api/3/ticker/pac_usd',
            ]
    
            const [
                btc_usd_data, pac_btc_data,
                eth_usd_data, pac_eth_data,
                doge_usd_data, pac_doge_data,
                waves_usd_data, pac_waves_data,
                pac_usd_data, 
            ] = await this.para('GET', 'yobit.net', apis)
        
            this.coins = []
    
            this.coins.push({
                exchange: this.title,
                coin: 'BTC',
                fiat: 'USDT',
                rate: pac_btc_data.pac_btc.last,
                fiat_rate: pac_btc_data.pac_btc.last * btc_usd_data.btc_usd.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'DOGE',
                fiat: 'USDT',
                rate: pac_doge_data.pac_doge.last,
                fiat_rate: pac_doge_data.pac_doge.last * doge_usd_data.doge_usd.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'ETH',
                fiat: 'USDT',
                rate: pac_eth_data.pac_eth.last,
                fiat_rate: pac_eth_data.pac_eth.last * eth_usd_data.eth_usd.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'WAVES',
                fiat: 'USDT',
                rate: pac_waves_data.pac_waves.last,
                fiat_rate: pac_waves_data.pac_waves.last * waves_usd_data.waves_usd.last
            })
            this.coins.push({
                exchange: this.title,
                coin: 'USDT',
                fiat: 'USDT',
                rate: pac_usd_data.pac_usd.last,
                fiat_rate: pac_usd_data.pac_usd.last
            })
            this.hasError = false
        } catch (error) {
            this.hasError = true
        }

        return this.rates()
    }
}

exports.class = ExchageYoBit
