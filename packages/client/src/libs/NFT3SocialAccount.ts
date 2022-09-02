import NFT3Client from './NFT3Client'
import NFT3Model from './NFT3Model'

export interface SocialAccountModel {
  account: string
  type: string
  proof: string
  verifier_key: string
  msghash: string
}

export default class NFT3SocialAccount {
  private model: NFT3Model<SocialAccountModel>
  private client: NFT3Client

  constructor(client: NFT3Client) {
    this.client = client
    this.model = client.model('social')
  }

  async list(identifier?: string) {
    identifier = identifier || this.client.did.identifier
    const result = await this.model.find({
      identifier,
      query: {}
    })
    return result
  }

  async add(record: SocialAccountModel) {
    await this.model.insertOne(record)
  }

  async remove(dataId: string) {
    await this.model.deleteOne(dataId)
  }
}
