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

  async info(identifier?: string) {
    identifier = identifier || this.client.did.identifier
    if (!identifier) throw new Error('identifier required')
    const profile = await this.model.findOne({
      identifier,
      query: {}
    })
    return profile || undefined
  }

  async update(profile: ProfileModel) {
    if (!this.client.did.identifier) throw new Error('authentication required')
    profile.name = profile.name || ''
    profile.avatar = profile.avatar || ''
    profile.bio = profile.bio || ''
    profile.gender = profile.gender || ''
    profile.url = profile.url || ''
    profile.location = profile.location || ''
    profile.attrs = profile.attrs || []
    const record = await this.info()
    if (!record) await this.model.insertOne(profile)
    else await this.model.updateOne(record.dataId, profile)
  }
}
