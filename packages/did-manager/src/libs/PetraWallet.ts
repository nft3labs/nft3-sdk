import { IWallet, NetworkType, WalletType } from './types'

export default class PetraWallet implements IWallet {
  chainId: number = 1
  network: NetworkType = 'Aptos'
  wallet: WalletType
  account?: string
  provider: any

  constructor(wallet: WalletType, provider?: any) {
    this.wallet = wallet
    if (provider) this.provider = provider
  }

  async connect(): Promise<string> {
    this.provider = aptos
    const resp = await this.provider.connect()
    this.account = resp.address
    return resp.address
  }

  async disconnect() {
    await aptos.disconnect()
  }

  onAccountChanged(callback: any) {
    this.provider.onAccountChange(callback)
  }

  onChainChanged() {}

  onDisconnect(callback: any) {
    this.provider.onDisconnect(callback)
  }
}
