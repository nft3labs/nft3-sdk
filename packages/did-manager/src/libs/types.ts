export type NetworkType = 'Ethereum' | 'Solana'
export type WalletType = 'MetaMask' | 'WalletConnect' | 'Phantom'
export interface IWallet {
  wallet: WalletType
  network: NetworkType
  account?: string
  provider?: any
  connect: (silent?: boolean) => Promise<string | undefined>
  disconnect: () => Promise<void>
  onAccountChanged: (callback: any) => void
  onDisconnect: (callback: any) => void
}
