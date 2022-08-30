import NFT3Client from './NFT3Client'
import NFT3Model from './NFT3Model'

export interface ProfileModel {
  name: string
  avatar: string
  bio: string
  url: string
  gender: string
  location: string
  attrs: { key: string; value: string }[]
}

export default class NFT3Profile {
  private model: NFT3Model<ProfileModel>
  private client: NFT3Client

  constructor(client: NFT3Client) {
    this.client = client
    this.model = client.model('profile')
  }

  async get(identifier?: string) {
    identifier = identifier || this.client.did.identifier
    if (!identifier) throw new Error('identifier required')
    const profile = await this.model.findOne({
      controller: identifier,
      query: {}
    })
    return profile
  }

  async set(profile: ProfileModel) {
    if (!this.client.did.identifier) throw new Error('authentication required')
    const record = await this.get()
    if (!record) await this.model.insertOne(profile)
    else await this.model.updateOne(record.dataId, profile)
  }
}
