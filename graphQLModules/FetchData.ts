require('dotenv').config()
const fetch = require('node-fetch');

interface Assets {
    asset_id: string
    name: string,
    type_is_crypto: number,
    data_quote_start: string | undefined,
    data_quote_end: string | undefined,
    data_trade_start: string | undefined,
    data_trade_end: string | undefined,
    data_symbols_count: number | undefined,
    volume_1hrs_usd: number | undefined,
    volume_1day_usd: number | undefined,
    volume_1mth_usd: number | undefined,
    price_usd: number | undefined,
    data_start: string | undefined,
    data_end: string | undefined
}

interface IconsUrl {
    asset_id: string | undefined
    url: string | undefined
}

interface Arguments {
    ASSET_ID: string,
    PERIOD_ID: string,
    TIME_START: string
}

interface Header {
    'X-CoinAPI-Key': string | undefined
}

const apiKey = 'D94B6CE1-9A77-40A9-863C-56B0F921C456'
const BASE_URL = 'https://rest.coinapi.io/v1'
const QUOTE_ID = 'USD'

let requestHeaders: Header = { 'X-CoinAPI-Key': apiKey };
const config = { method: 'GET', headers: requestHeaders }

const handleResult = (res: Response) => {
    return res.json()
}

const handleError = (err: Error) => err.message

export const fetchAssets = async () => {
    const assets_url = `${BASE_URL}/assets`
    const icons_url = `${BASE_URL}/assets/icons/10`

    const assets_response = await fetch(assets_url, config)
        .then(handleResult)
        .catch(handleError)

    if (assets_response === undefined || assets_response.length === 0) {
        return assets_response
    }

    const onlyCoins = assets_response.filter((asset: { type_is_crypto: number, price_usd: number, data_trade_start: string }) =>
        asset.type_is_crypto === 1 &&
        asset.price_usd !== undefined &&
        asset.data_trade_start !== undefined)

    const icons_response = await fetch(icons_url, config)
        .then(handleResult)
        .catch(handleError)

    if (icons_response === undefined || icons_response.length === 0) {
        return icons_response
    }

    const assetsArray = onlyCoins.map((onlyCoins_obj: Assets) => {
        let icon_url_object = icons_response.find((icon_obj: IconsUrl) => icon_obj.asset_id === onlyCoins_obj.asset_id)
        return {
            ...onlyCoins_obj, icon_url: icon_url_object ? icon_url_object.url : null
        }
    })
    return assetsArray
}

export const fetchHistoricData = async (parent: any, args: Arguments) => {
    const { ASSET_ID, PERIOD_ID, TIME_START } = args
    const TIME_END = new Date().toISOString()
    const history_url = `${BASE_URL}/exchangerate/${ASSET_ID}/${QUOTE_ID}/history?period_id=${PERIOD_ID}&time_start=${TIME_START}&time_end=${TIME_END}`
    const historic_data_response = await fetch(history_url, config)
        .then(handleResult)
        .catch(handleError)

    if (historic_data_response === undefined || historic_data_response.length === 0) {
        return historic_data_response
    }

    return historic_data_response
}