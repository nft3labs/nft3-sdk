import { Web3Provider } from '@ethersproject/providers'
import { IWallet, NetworkType, WalletType } from './types'

export default class EthereumWallet implements IWallet {
  network: NetworkType = 'Ethereum'
  wallet: WalletType
  account?: string
  provider?: Web3Provider

  constructor(wallet: WalletType, provider?: any) {
    this.wallet = wallet
    if (provider) this.provider = provider
  }

  async connect(silent = false) {
    this.provider = new Web3Provider(ethereum)
    if (this.account) return this.account
    let accounts: string[] = []
    if (silent === true) {
      accounts = await this.provider.send('eth_accounts', [])
    } else {
      accounts = await this.provider.send('eth_requestAccounts', [])
    }
    this.account = accounts[0]
    return this.account!
  }

  async disconnect() {}

  onAccountChanged(callback: any) {
    ethereum.on('accountsChanged', callback)
  }

  onDisconnect() {}
}
