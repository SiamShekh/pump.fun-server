const transformedValue = (value) => {
    const no = (value * 1e8).toFixed(4);
    return no;
}

const Charts = async (req, res) => {
    try {
        const contract = req.query.ca;

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

        res.json(ChartFilter);
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = Charts;
