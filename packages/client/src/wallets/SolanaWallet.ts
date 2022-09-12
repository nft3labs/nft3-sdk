import { sign, SignKeyPair } from 'tweetnacl'
import { Base58 } from '@ethersproject/basex'

import { NFT3Wallet, NetworkType } from '../types/model'

export default class SolanaWallet implements NFT3Wallet {
  public network: NetworkType
  private keyPair?: SignKeyPair
  private signer?: any

  constructor(options: {
    network: NetworkType
    privateKey?: string
    signer?: any
  }) {
    this.network = options.network
    if (options.privateKey) {
      const secretKey = Base58.decode(options.privateKey)
      this.keyPair = sign.keyPair.fromSecretKey(secretKey)
    }
    if (options.signer) {
      this.signer = options.signer
    }
  }

  async signMessage(message: string) {
    const text = new TextEncoder().encode(message)
    if (this.signer) {
      const { signature, publicKey } = await this.signer.signMessage(text, 'hex')
      return {
        publicKey,
        signature: Base58.encode(signature),
        signatureBuffer: signature
      }
    }
    if (this.keyPair) {
      const result = sign.detached(text, this.keyPair.secretKey)
      return {
        publicKey: Base58.encode(this.keyPair.publicKey),
        signature: Base58.encode(result),
        signatureBuffer: result
      }
    }
  }
}
