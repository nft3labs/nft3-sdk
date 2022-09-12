import { Wallet } from '@ethersproject/wallet'
import { Signer } from '@ethersproject/abstract-signer'
import { hashMessage } from '@ethersproject/hash'
import { arrayify } from '@ethersproject/bytes'
import { recoverPublicKey } from '@ethersproject/signing-key'

import { NetworkType, NFT3Wallet } from '../types/model'

export default class EthereumWallet implements NFT3Wallet {
  public network: NetworkType
  private wallet?: Wallet | Signer

  constructor(options: {
    network: NetworkType
    privateKey?: string
    signer?: any
  }) {
    this.network = options.network
    if (options.privateKey) {
      this.wallet = new Wallet(options.privateKey)
    }
    if (options.signer) {
      this.wallet = options.signer
    }
  }

  async signMessage(message: string) {
    const signature = await this.wallet.signMessage(message)
    const signHash = arrayify(hashMessage(message))
    const publicKey = recoverPublicKey(signHash, signature)
    return {
      publicKey,
      signature,
      signatureBuffer: arrayify(signature)
    }
  }
}
