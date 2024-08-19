const { PythHttpClient, getPythClusterApiUrl, getPythProgramKeyForCluster } = require("@pythnetwork/client");
const { Connection, PublicKey } = require("@solana/web3.js");

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_ENDPOINT);

async function getTokenPrice(priceFeedAddress) {
    // Initialize PythHttpClient
    const pythPublicKey = getPythProgramKeyForCluster('mainnet-beta');
    const pythClient = new PythHttpClient(connection, pythPublicKey);

    // Get price data using PythHttpClient
    const priceData = await pythClient.getPriceFeeds([new PublicKey(priceFeedAddress)]);

    if (priceData && priceData.length > 0) {
        const price = priceData[0].getPriceNoOlderThan(60); // Get price no older than 60 seconds
        if (price) {
            console.log(`Token price: $${price.price}`);
            return price.price;
        }
    } else {
        console.error('Price data not found or not available');
        return null;
    }
}

// Example usage with your price feed address
const priceFeedAddress = "7TgtoHwB4oQKQE7vYESWk2KWi5FZDtNCyrwS34fUyiq9";
getTokenPrice(priceFeedAddress).then(price => console.log("Price:", price));
