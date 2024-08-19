const { PublicKey, Connection } = require('@solana/web3.js');

const Holders = async (contractAddress) => {
    const connection = await new Connection('https://api.mainnet-beta.solana.com');

    try {
        const publicKey = new PublicKey(contractAddress);

        const tokenSupplyResponse = await connection.getTokenSupply(publicKey);
        const totalSupply = tokenSupplyResponse.value.uiAmount;

        if (totalSupply === 0) {
            return [];
        }

        const tokenAccountsResponse = await connection.getTokenLargestAccounts(publicKey);
        const tokenAccounts = tokenAccountsResponse.value;

        if (tokenAccounts.length === 0) {
            return res.json({ holders: [] });
        }

        const holders = tokenAccounts.map(accountInfo => {
            const amount = accountInfo.uiAmount;
            const percentage = ((amount / totalSupply) * 100).toFixed(2);
            return {
                address: accountInfo.address.toBase58(),
                amount,
                percentage
            };
        });

        return holders;
    } catch (error) {
        return []
    }
};

module.exports = Holders;