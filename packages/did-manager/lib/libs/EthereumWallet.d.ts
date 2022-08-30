import { Web3Provider } from '@ethersproject/providers';
import { IWallet, NetworkType, WalletType } from './types';
export default class EthereumWallet implements IWallet {
    network: NetworkType;
    wallet: WalletType;
    account?: string;
    provider?: Web3Provider;
    constructor(wallet: WalletType, provider?: any);
    connect(silent?: boolean): Promise<string>;
    disconnect(): Promise<void>;
    onAccountChanged(callback: any): void;
    onDisconnect(): void;
}
