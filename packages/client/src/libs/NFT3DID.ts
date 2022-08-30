import { id, hashMessage } from '@ethersproject/hash'
import { sha256 } from '@ethersproject/sha2'
import { Wallet } from '@ethersproject/wallet'
import { joinSignature, arrayify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import { Signer } from '@ethersproject/abstract-signer'
import { SigningKey, recoverPublicKey } from '@ethersproject/signing-key'
import NFT3Client from './NFT3Client'
export type NetworkType = 'ethereum' | 'solana'

const SessionExpires = 72 * 3600
const SignExpires = 300

export default class NFT3DID {
  private network: NetworkType
  private client: NFT3Client
  private wallet?: Wallet | Signer
  public signKey?: string
  public signer?: SigningKey
  public identifier = ''

  constructor(client: NFT3Client) {
    this.client = client
  }

  config(options: {
    network: NetworkType
    privateKey?: string
    signKey?: string
    signer?: Signer
  }) {
    this.network = options.network
    this.signKey = options.signKey
    if (options.privateKey) {
      this.wallet = new Wallet(options.privateKey)
    }
    if (options.signer) {
      this.wallet = options.signer
    }
    if (this.signKey) {
      this.signer = new SigningKey(this.signKey)
    }
  }

  /**
   * create session signer
   */
  async init() {
    if (this.signKey) return this.signKey
    const message = 'Allow this account to control your did'
    const signature = await this.wallet?.signMessage(message)
    if (signature) {
      this.signKey = sha256(signature)
      this.signer = new SigningKey(this.signKey)
      return this.signKey
    }
  }

  async auth() {
    this.init()
    let identifier = await this.checkLogin()
    if (identifier) return identifier
    identifier = await this.login()
    if (identifier) return identifier
    return undefined
  }

  /**
   * session key signature
   * @param message
   * @returns
   */
  sign(message: string) {
    const msghash = id(message)
    const signature = joinSignature(this.signer.signDigest(msghash))
    return {
      msghash,
      signature
    }
  }

  /**
   * format params for signMessage
   * @param message
   * @returns
   */
  private formatMessage(message: Record<string, any>) {
    const keys = Object.keys(message).sort()
    const items: string[] = []
    for (const key of keys) {
      items.push(`${key}=${message[key]}`)
    }
    return items.join('&')
  }

  /**
   * sign message add send request
   * @param method
   * @param params
   * @returns
   */
  async send<T = any>(
    method: string,
    params: {
      msg: Record<string, any>
      [propName: string]: any
    }
  ) {
    if (!this.signer) {
      throw new Error('DID need auth first')
    }
    const msg = {
      ...params.msg,
      sign_expired_at: Math.trunc(Date.now() / 1000 + SignExpires)
    }
    const message = this.formatMessage(msg)
    const length = toUtf8Bytes(message).length
    const str = `${method}:\n${length}${message}`
    const { signature } = this.sign(str)
    params.msg = msg
    params.session_sign = signature
    return this.client.send<T>(method, params)
  }

  /**
   * ctrl key signature
   * @param msg
   * @returns
   */
  private async ctrlSign(msg: Record<string, any>) {
    msg.sign_expired_at = Math.trunc(Date.now() / 1000 + SignExpires)
    msg.session_key = this.signer.publicKey
    msg.session_key_expired_at = Math.trunc(Date.now() / 1000 + SessionExpires)
    const message = this.formatMessage(msg)
    const signature = await this.wallet.signMessage(message)
    const signHash = arrayify(hashMessage(message))
    const publicKey = recoverPublicKey(signHash, signature)
    return {
      ctrlKey: `${this.network}:${publicKey}`,
      ctrlSign: signature
    }
  }

  /**
   * register did
   * @param identifier
   * @returns
   */
  async register(identifier: string) {
    await this.init()
    const msg: Record<string, any> = {
      identifier
    }
    const { ctrlKey, ctrlSign } = await this.ctrlSign(msg)
    const params = {
      msg,
      ctrl_key: ctrlKey,
      ctrl_sign: ctrlSign
    }
    const result = await this.client.send<string>('nft3_did_register', params)
    return {
      result: true,
      identifier: result
    }
  }

  /**
   * login did
   */
  async login() {
    await this.init()
    const msg = {}
    const { ctrlKey, ctrlSign } = await this.ctrlSign(msg)
    const params = {
      msg,
      ctrl_key: ctrlKey,
      ctrl_sign: ctrlSign
    }
    const result = await this.client.send<string>('nft3_did_login', params)
    this.identifier = result
    return {
      result: true,
      identifier: result
    }
  }

  /**
   * DID logout
   */
  async logout() {
    this.signKey = undefined
    this.signer = undefined
  }

  /**
   * check did login status
   * @returns
   */
  async checkLogin() {
    try {
      const result = await this.send<string>('nft3_did_check_login', {
        msg: {}
      })
      this.identifier = result
      return {
        result: true,
        identifier: result
      }
    } catch (error) {
      return {
        result: false
      }
    }
  }

  /**
   * add current wallet as ctrl key
   * @returns
   */
  async addKey() {
    const subParams: any = { msg: {} }
    const { ctrlKey, ctrlSign } = await this.ctrlSign(subParams.msg)
    subParams.ctrl_key = ctrlKey
    subParams.ctrl_sign = ctrlSign
    const result = await this.send('nft3_did_keys_add', {
      msg: {
        msg: JSON.stringify(subParams),
        new_ctrl_key: ctrlKey,
        new_ctrl_sign: ctrlSign
      }
    })
    return {
      result: true
    }
  }

  /**
   * remove current wallet from ctrl keys
   * @returns
   */
  async removeKey() {
    const subParams: any = { msg: {} }
    const { ctrlKey, ctrlSign } = await this.ctrlSign(subParams.msg)
    subParams.ctrl_key = ctrlKey
    subParams.ctrl_sign = ctrlSign
    const result = await this.send('nft3_did_keys_remove', {
      msg: {
        msg: JSON.stringify(subParams),
        remove_ctrl_key: ctrlKey,
        remove_ctrl_sign: ctrlSign
      }
    })
    return {
      result: true
    }
  }

  /**
   * list all of the crypto accounts of current did
   * @returns
   */
  async accounts() {
    const result = await this.send('nft3_did_address', {
      msg: {}
    })
    return result
  }
}
