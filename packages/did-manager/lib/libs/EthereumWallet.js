"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
class EthereumWallet {
    network = 'Ethereum';
    wallet;
    account;
    provider;
    constructor(wallet, provider) {
        this.wallet = wallet;
        if (provider)
            this.provider = provider;
    }
    async connect(silent = false) {
        this.provider = new providers_1.Web3Provider(ethereum);
        if (this.account)
            return this.account;
        let accounts = [];
        if (silent === true) {
            accounts = await this.provider.send('eth_accounts', []);
        }
        else {
            accounts = await this.provider.send('eth_requestAccounts', []);
        }
        this.account = accounts[0];
        return this.account;
    }
    async disconnect() { }
    onAccountChanged(callback) {
        ethereum.on('accountsChanged', callback);
    }
    onDisconnect() { }
}
exports.default = EthereumWallet;
