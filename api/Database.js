const cheerio = require('cheerio');
const { Schema, default: mongoose } = require('mongoose');
const TokenSchemas = new Schema({
    mint: String,
    name: String,
    symbol: String,
    description: String,
    metadata_uri: String,
    twitter: String,
    telegram: String,
    bonding_curve: String,
    associated_bonding_curve: String,
    creator: String,
    created_timestamp: String,
    raydium_pool: String,
    complete: String,
    virtual_sol_reserves: String,
    virtual_token_reserves: String,
    hidden: String,
    total_supply: String,
    website: String,
    show_name: String,
    last_trade_timestamp: String,
    king_of_the_hill_timestamp: String,
    market_cap: String,
    reply_count: String,
    last_reply: String,
    nsfw: String,
    market_id: String,
    inverted: String,
    is_currently_live: String,
    username: String,
    profile_image: String,
    usd_market_cap: String,
});

const TokenModel = mongoose.model("Token", TokenSchemas);

const InsertToken = async (data) => {
    const TokenInfo = await TokenModel.insertMany(data);
    return TokenInfo
};

const transformedValue = (value) => {
    const no = (value * 1e8).toFixed(4);
    return no;
}

const Charts = async (contract) => {
    const solPrice = await fetch(`https://frontend-api.pump.fun/sol-price`).then(res => res.json());

    const charts = await fetch(`https://frontend-api.pump.fun/candlesticks/${contract}?offset=0&limit=1000&timeframe=5`).then(res => res.json());

    const ChartFilter = charts.map((item, index) => {

        const openPriceSOL = Number(item.open) / solPrice?.solPrice;
        const highPriceSOL = Number(item.high) / solPrice?.solPrice;
        const lowPriceSOL = Number(item.low) / solPrice?.solPrice;
        const closePriceSOL = Number(item.close) / solPrice?.solPrice;

        return {
            date: item?.timestamp,
            open: transformedValue(openPriceSOL.toFixed(15)),
            high: transformedValue(highPriceSOL.toFixed(15)),
            low: transformedValue(lowPriceSOL.toFixed(15)),
            close: transformedValue(closePriceSOL.toFixed(15)),
            volume: item.volume,
            slot: item.slot,
        };
    });

    return ChartFilter;
}

const DetailsInformission = async (req, res) => {
    const mint = req.query.mint;
    const SignleData = await TokenModel.findOne({ mint: mint });

    const Reply = await fetch(`https://frontend-api.pump.fun/replies/${mint}?limit=1000&offset=0`)
        .then(res => res.json());

    const chart = await Charts(mint);

    res.send({ SignleData, Reply, chart });
};

module.exports = {
    InsertToken,
    DetailsInformission
};