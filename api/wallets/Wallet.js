const { Schema, default: mongoose } = require("mongoose");

const WalletsSchema = new Schema({
    publicKeyAddress: {
        type: String,
        required: true,
        unique: true,
    },
    virtualWallet: {
        walletPublicKey: {
            required: true,
            type: String
        },
        privateKey: {
            required: true,
            type: String
        },
        apiKey: {
            required: true,
            type: String
        },
    }
});

const WalletsModel = mongoose.model("Wallets", WalletsSchema);

const CreateWallets = async (req, res) => {
    const address = req.query.pub;
    const GenareteWallets = await fetch("https://pumpportal.fun/api/create-wallet").then(res => res.json());
    const WalletObject = {
        publicKeyAddress: address,
        virtualWallet: GenareteWallets
    };
    const Result = await WalletsModel.create(WalletObject);
    res.send(Result);
};

const RetriveWallets = async (req, res) => {
    const address = req.query.pub;
    const find = await WalletsModel.findOne({ publicKeyAddress: address });
    res.send(find);
};

const AllVirtualWallets = async (req, res) => {
    const result = await WalletsModel.find({});
    res.send(result);
}

module.exports = {
    CreateWallets,
    RetriveWallets,
    WalletsModel,
    AllVirtualWallets
}