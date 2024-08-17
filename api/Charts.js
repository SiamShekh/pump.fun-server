
const Charts = async (req, res) => {
    try {
        const contract = req.query.ca;

        // Fetch the current SOL price in USD
        const solPrice = await fetch(`https://frontend-api.pump.fun/sol-price`).then(res => res.json());

        // Fetch the candlestick data
        const charts = await fetch(`https://frontend-api.pump.fun/candlesticks/${contract}?offset=0&limit=1000&timeframe=5`).then(res => res.json());

        // Process and filter the candlestick data
        const ChartFilter = charts.map((item, index) => {
            // Convert timestamp to human-readable date
            const date = new Date(item.timestamp * 1000).toISOString().split('T')[0];

            // Convert prices to SOL
            const openPriceSOL = Number(item.open) / solPrice?.solPrice;
            const highPriceSOL = Number(item.high) / solPrice?.solPrice;
            const lowPriceSOL = Number(item.low) / solPrice?.solPrice;
            const closePriceSOL = Number(item.close) / solPrice?.solPrice;

            return {
                date: date,
                open: openPriceSOL.toFixed(15),
                high: highPriceSOL.toFixed(15),
                low: lowPriceSOL.toFixed(15),
                close: closePriceSOL.toFixed(15),
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
