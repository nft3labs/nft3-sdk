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
    let profile = await this.model.findOne({
      identifier,
      query: {}
    })
    if (!profile) {
      const result = await this.client.did.info(identifier)
      if (result) {
        profile = {
          __owner: identifier,
          dataId: '',
          name: identifier.split(':')[2],
          avatar: '',
          bio: '',
          url: '',
          gender: '',
          location: '',
          attrs: [],
          createdAt: result.created_at,
          updatedAt: result.updated_at
        }
      }
    }
    return profile || undefined
  }

  async update(profile: Partial<ProfileModel>) {
    if (!this.client.did.identifier) throw new Error('authentication required')
    const record = await this.info()
    const item: ProfileModel = {
      name: profile.name || record?.name || '',
      avatar: profile.avatar || record?.avatar || '',
      bio: profile.bio || record?.bio || '',
      gender: profile.gender || record?.gender || '',
      url: profile.url || record?.url || '',
      location: profile.location || record?.location || '',
      attrs: profile.attrs || record?.attrs || []
    }
    if (!record || !record.dataId) await this.model.insertOne(item)
    else await this.model.updateOne(record.dataId, item)
  }
}
