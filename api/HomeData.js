
const HomeDataService = async (req, res) => {
    const List = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=500&sort=last_trade_timestamp&order=DESC&includeNsfw=true")
        .then(res => res.json());

    const Popular = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=reply_count&order=DESC&includeNsfw=true")
        .then(res => res.json());

    const TopGainers = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=market_cap&order=DESC&includeNsfw=true")
        .then(res => res.json());

    const New = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=created_timestamp&order=DESC&includeNsfw=true")
        .then(res => res.json());

    return res.send({
        List,
        Popular,
        TopGainers,
        New
    })
};

module.exports = HomeDataService;