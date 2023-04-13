import { sign, SignKeyPair } from 'tweetnacl'
import { arrayify, hexlify } from '@ethersproject/bytes'

import { NFT3Wallet, NetworkType } from '../types/model'

export default class AptosWallet implements NFT3Wallet {
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
      const secretKey = arrayify(options.privateKey)
      this.keyPair = sign.keyPair.fromSeed(secretKey)
    }
    if (options.signer) {
      this.signer = options.signer
    }
  }

  async signMessage(message: string) {
    const nonce = Date.now().toString()
    if (this.signer) {
      const { publicKey } = await this.signer.account()
      const resp = await this.signer.signMessage({
        message,
        nonce
      })
      const buffer = arrayify('0x' + resp.signature)
      const result = {
        nonce,
        publicKey,
        signature: '0x' + resp.signature,
        signatureBuffer: buffer
      }
      return result
    }
    if (this.keyPair) {
      message = `APTOS\nmessage: ${message}\nnonce: ${nonce}`
      const bytes = new TextEncoder().encode(message)
      const signature = sign.detached(bytes, this.keyPair.secretKey)
      return {
        nonce,
        publicKey: hexlify(this.keyPair.publicKey),
        signature: hexlify(signature),
        signatureBuffer: signature
      }
    }
  }
}
