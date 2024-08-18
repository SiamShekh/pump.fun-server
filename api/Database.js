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

const SingledataInformission = async (req, res) => {
    const mint = req.params.mint;
    const SignleData = await TokenModel.findOne({ mint: mint });
    res.send(SignleData);
};

module.exports = {
    InsertToken,
    SingledataInformission
};