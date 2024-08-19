const { WalletsModel } = require("./wallets/Wallet");

const Profile = async (req, res) => {
    const mint = req?.query?.mint;

    const virtualWallet = await WalletsModel.findOne({ publicKeyAddress: mint });
    let created;

    if (virtualWallet == null) {
        created = await fetch(`https://frontend-api.pump.fun/coins/user-created-coins/${mint}?offset=0&limit=10&includeNsfw=true`).then(res => res.json());

    } else {
        created = await fetch(`https://frontend-api.pump.fun/coins/user-created-coins/${virtualWallet?.virtualWallet?.walletPublicKey}?offset=0&limit=10&includeNsfw=true`)
    }
    const balance = await fetch(`https://frontend-api.pump.fun/balances/${mint}?limit=50&offset=0&minBalance=-1`).then(res => res.json());

    res.send({
        balance,
        created
    });
};

module.exports = Profile;