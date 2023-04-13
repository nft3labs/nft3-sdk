import { Web3Provider } from '@ethersproject/providers'
import { IWallet, NetworkType, WalletType } from './types'

export default class EthereumWallet implements IWallet {
  chainId: number = 1
  wallet: WalletType
  account?: string
  provider?: Web3Provider

  constructor(wallet: WalletType, provider?: any) {
    this.wallet = wallet
    if (provider) this.provider = provider
  }

  get network(): NetworkType {
    switch (this.chainId) {
      case 137:
        return 'Polygon'
      case 56:
        return 'BNB'
      case 42161:
        return 'Arb'
      case 10:
        return 'OP'
      default:
        return 'Ethereum'
    }
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
    const chainId = await this.provider.send('eth_chainId', [])
    this.chainId = parseInt(chainId, 16)
    this.account = accounts[0]
    return this.account!
  }

  async disconnect() {}

  onAccountChanged(callback: any) {
    ethereum.on('accountsChanged', callback)
  }

  onChainChanged(callback: any) {
    ethereum.on('chainChanged', (chainId: string) => {
      this.chainId = parseInt(chainId, 16)
      callback(this.chainId)
    })
  }

  onDisconnect() {}
}
