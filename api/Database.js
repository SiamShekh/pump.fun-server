const { Schema, default: mongoose } = require('mongoose');
const Holders = require('./coins-holder/CoinHolderByContractAddress');
const { load } = require('cheerio');

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

    const htmlFetch = await fetch(`https://pump.fun/${mint}`).then(res => res.text());
    const $ = load(htmlFetch);
    const bonding_curve = $("script").text().split("Taking too long")[1].split("children")[1].split("coin")[1].split("toggleNsf")[0];
    let cleanedString = bonding_curve.replace(/\\+/g, '').slice(2,-2);
    const SignleData = JSON.parse(cleanedString);

    const Reply = await fetch(`https://frontend-api.pump.fun/replies/${mint}?limit=1000&offset=0`)
        .then(res => res.json());

    const Trade = await fetch(`https://frontend-api.pump.fun/trades/${mint}?limit=1000&offset=0`)
        .then(res => res.json());

    const chart = await Charts(mint);
    const Holder = await Holders(mint);
    res.send({ SignleData, Reply, chart, Trade, Holder });
};

module.exports = {
    DetailsInformission
};