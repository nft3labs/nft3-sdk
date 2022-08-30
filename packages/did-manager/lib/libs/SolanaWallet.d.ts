import { IWallet, NetworkType, WalletType } from './types';
export default class SolanaWallet implements IWallet {
    network: NetworkType;
    wallet: WalletType;
    provider: any;
    constructor(wallet: WalletType, provider?: any);
    get account(): any;
    connect(silent?: boolean): Promise<string>;
    disconnect(): Promise<void>;
    onAccountChanged(callback: any): void;
    onDisconnect(callback: any): void;
}
