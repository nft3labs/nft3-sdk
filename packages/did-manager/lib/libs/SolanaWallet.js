"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SolanaWallet {
    network = 'Solana';
    wallet;
    provider;
    constructor(wallet, provider) {
        this.wallet = wallet;
        if (provider)
            this.provider = provider;
    }
    get account() {
        return this.provider.publicKey.toString();
    }
    async connect(silent = false) {
        this.provider = solana;
        const resp = await this.provider.connect({
            onlyIfTrusted: silent
        });
        return resp.publicKey.toString();
    }
    async disconnect() {
        await solana.disconnect();
    }
    onAccountChanged(callback) {
        this.provider.on('accountChanged', callback);
    }
    onDisconnect(callback) {
        this.provider.on('disconnect', callback);
    }
}
exports.default = SolanaWallet;
