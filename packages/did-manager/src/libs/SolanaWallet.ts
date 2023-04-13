import { IWallet, NetworkType, WalletType } from './types'

export default class SolanaWallet implements IWallet {
  chainId: number = 1
  network: NetworkType = 'Solana'
  wallet: WalletType
  provider: any

  constructor(wallet: WalletType, provider?: any) {
    this.wallet = wallet
    if (provider) this.provider = provider
  }

  get account() {
    return this.provider.publicKey.toString()
  }

  async connect(silent = false): Promise<string> {
    this.provider = solana
    const resp = await this.provider.connect({
      onlyIfTrusted: silent
    })
    return resp.publicKey.toString()
  }

  async disconnect() {
    await solana.disconnect()
  }

  onAccountChanged(callback: any) {
    this.provider.on('accountChanged', callback)
  }
  
  onChainChanged() {}

  onDisconnect(callback: any) {
    this.provider.on('disconnect', callback)
  }
}
