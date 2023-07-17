const {Web3} = require("web3");


class EvmUtils {
    rpc = 'https://goerli.infura.io/v3/585336f85af047039abaaad4761a82e9';
    web3 = new Web3(this.rpc);


    constructor(rpc = this.rpc) {
        this.rpc = rpc;
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpc));
    }

    async processEvmAddress(address) {
        if (!address) {
            return '';
        }
        if (address.substring(0, 2) === '0x') {
            address = address.slice(2);
        }
        return address.toLowerCase();
    }

    async getAddressByPrivateKey(privateKey) {
        if (!privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey;
        }
        return this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
    }

    append0xToPrivateKey(privateKey) {
        return privateKey.startsWith('0x') ? privateKey : '0x' + privateKey;
    }


    async getBalanceByRPC(address, rpc = this.rpc) {
        let web3 = new Web3(rpc);
        let balanceInWei = await web3.eth.getBalance(address);
        let balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
        return parseFloat(balanceInEther).toFixed(4);
    }

    async getTokenBalance(address, abi, contractAddress, rpc = this.rpc) {
        return new Promise(async (resolve, reject) => {
            let web3 = new Web3(rpc);
            const tokenContract = new web3.eth.Contract(abi, contractAddress);
            await tokenContract.methods.balanceOf(address).call(function (err, result) {
                err ? reject(err) : resolve(result)
            }).then(function (balance) {
                resolve(balance)
            });
        });
    }


    async sendTransaction(privateKey, toAddress, encodedData, gasLimit, maxPriorityFeePerGas, maxFeePerGas, value = '0', returnReceipt = false) {
        return new Promise(async (resolve) => {
            try {
                privateKey = this.append0xToPrivateKey(privateKey);
                let senderAddress = await this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                let nonce = await this.web3.eth.getTransactionCount(senderAddress);
                let txData = {
                    value: this.web3.utils.toWei(value, 'ether'),
                    from: senderAddress,
                    to: toAddress,
                    nonce: this.web3.utils.toHex(nonce),
                    data: encodedData,
                    gasLimit: this.web3.utils.toHex(gasLimit),
                    maxPriorityFeePerGas: maxPriorityFeePerGas,
                    maxFeePerGas: maxFeePerGas,
                };
                let signedTx = await this.web3.eth.accounts.signTransaction(txData, privateKey);
                this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on('transactionHash', (hash) => {
                        console.table([{
                            'Tx_hash': hash,
                            '转账金额': value,
                            '接收地址': toAddress,
                        }]);
                        if (!returnReceipt) {
                            resolve(true);
                        }
                    })
                    .on('receipt', (receipt) => {
                        console.log('\x1b[32m%s\x1b[0m', `交易已打包: ${receipt.transactionHash}`);
                        if (returnReceipt) {
                            resolve(true);
                        }
                    })
                    .on('error', (error) => {
                        console.log('\x1b[31m%s\x1b[0m', `打包失败: ${error.message}`)
                        resolve(false);
                    });
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', `打包报错: ${e.message}`)
                resolve(false);
            }
        });

    }

    async sendDeftTransaction(privateKey, toAddress, encodedData, gasLimit, gasPrice, value = '0', returnReceipt = false) {
        return new Promise(async (resolve) => {
            try {
                privateKey = this.append0xToPrivateKey(privateKey);
                let senderAddress = await this.web3.eth.accounts.privateKeyToAccount(privateKey).address;
                let nonce = await this.web3.eth.getTransactionCount(senderAddress);
                let txData = {
                    value: this.web3.utils.toWei(value, 'ether'),
                    from: senderAddress,
                    to: toAddress,
                    nonce: this.web3.utils.toHex(nonce),
                    data: encodedData,
                    gasLimit: this.web3.utils.toHex(gasLimit),
                    gasPrice: gasPrice,
                };
                let signedTx = await this.web3.eth.accounts.signTransaction(txData, privateKey);
                this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                    .on('transactionHash', (hash) => {
                        console.table([{
                            'Tx_hash': hash,
                            '转账金额': value,
                            '接收地址': toAddress,
                        }]);
                        if (!returnReceipt) {
                            resolve(true);
                        }
                    })
                    .on('receipt', (receipt) => {
                        console.log('\x1b[32m%s\x1b[0m', `交易已打包: ${receipt.transactionHash}`);
                        if (returnReceipt) {
                            resolve(true);
                        }
                    })
                    .on('error', (error) => {
                        console.log('\x1b[31m%s\x1b[0m', `打包失败: ${error.message}`)
                        resolve(false);
                    });
            } catch (e) {
                console.log('\x1b[31m%s\x1b[0m', `打包报错: ${e.message}`)
                resolve(false);
            }
        });

    }
}

module.exports = EvmUtils;
