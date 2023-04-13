export type NetworkType =
  | 'Ethereum'
  | 'Solana'
  | 'Polygon'
  | 'BNB'
  | 'Arb'
  | 'OP'
  | 'Aptos'
export type WalletType = 'MetaMask' | 'Phantom' | 'Petra'
export interface IWallet {
  chainId: number
  wallet: WalletType
  network: NetworkType
  account?: string
  provider?: any
  connect: (silent?: boolean) => Promise<string | undefined>
  disconnect: () => Promise<void>
  onAccountChanged: (callback: any) => void
  onChainChanged: (callback: any) => void
  onDisconnect: (callback: any) => void
}
