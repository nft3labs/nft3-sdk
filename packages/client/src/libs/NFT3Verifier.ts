import axios, { AxiosInstance } from 'axios'
import { id } from '@ethersproject/hash'
import { recoverPublicKey } from '@ethersproject/signing-key'

import NFT3Client from './NFT3Client'

export interface VerifyInfo {
  proof: string
  did: string
  type: string
  account: string
}

export interface VerifyResult extends VerifyInfo {
  result: boolean
}

export default class NFT3Verifier {
  private readonly verifierKey =
    '0x04dade9c207c089e8c9da299ad66c3baeae6006671f103aef5a0c41b9bd20a8e97e4104d0ff5f44ac7ca67b628ea1c3e9e1bf27ae497206ce1886e7b533d75de4c'
  private request: AxiosInstance
  private client: NFT3Client

  constructor(client: NFT3Client, endpoint: string) {
    this.client = client
    this.request = axios.create({
      baseURL: endpoint.replace(/\/$/, '')
    })
  }

  requestTwitter() {
    const message = 'Allow this App to verify your Twitter account'
    const { msghash, signature } = this.client.did.sign(message)
    const text = `NFT3 signed for ${this.client.did.identifier}, sig: ${signature}`
    const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`
    return {
      link,
      text,
      msghash
    }
  }

  async verifyTwitter(account: string, msghash: string) {
    const params = new URLSearchParams()
    params.set('did', 'did:nft3:alice')
    params.set('account', account)
    params.set('msghash', msghash.replace(/^0x/, ''))
    const query = params.toString()
    const url = `/requestVerify/twitter?${query}`
    const { data } = await this.request.get(url)
    const info: VerifyResult = {
      result: data.data.result,
      proof: '0x' + data.data.proof,
      did: data.data.did,
      type: data.data.social_type,
      account: data.data.social_account
    }
    return info
  }

  verifyProof(info: VerifyInfo) {
    const message = `NFT3-Verifier:\n${info.did}\n${info.type}\n${info.account}`
    const signHash = id(message)
    const publicKey = recoverPublicKey(signHash, '0x' + info.proof)
    const result = publicKey === this.verifierKey
    return result
  }
}
