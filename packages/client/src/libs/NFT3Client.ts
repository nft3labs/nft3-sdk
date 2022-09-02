import NFT3Gateway from './NFT3Gateway'
import NFT3DID from './NFT3DID'
import NFT3Schema from './NFT3Schema'
import NFT3Model from './NFT3Model'
import NFT3Profile from './NFT3Profile'
import NFT3SocialAccount from './NFT3SocialAccount'

export default class NFT3Client {
  private gateway: NFT3Gateway
  profile: NFT3Profile
  did: NFT3DID
  socialAccount: NFT3SocialAccount

  constructor(endpoint: string) {
    this.gateway = new NFT3Gateway(endpoint)
    this.did = new NFT3DID(this)
    this.profile = new NFT3Profile(this)
    this.socialAccount = new NFT3SocialAccount(this)
  }

  send<T = any>(method: string, params: Record<string, any> = {}) {
    return this.gateway.send<T>(method, params)
  }

  schema() {
    return new NFT3Schema(this, this.did)
  }

  model<T = any>(modelId: string) {
    return new NFT3Model<T>(this, modelId)
  }
}
