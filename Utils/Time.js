const Web3 = require("web3");
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function getEvmBlockDate() {
    return new Promise(async (resolve, reject) => {
        try {
            const web3 = new Web3('https://eth-mainnet.g.alchemy.com/v2/perN5GAiO2D79c-ogrqD8f2N8cglTT5Y');
            const blockNumber = await web3.eth.getBlockNumber();
            await web3.eth.getBlock(blockNumber, (error, block) => {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    const timestamp = block.timestamp;
                    resolve(timestamp);
                }
            });
        }catch (e) {
            console.error(e);
            reject(e);
        }
    });

}

module.exports = {
    sleep,
    getEvmBlockDate,
}
