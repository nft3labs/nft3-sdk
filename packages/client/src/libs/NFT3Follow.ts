import NFT3Client from './NFT3Client'
import NFT3Model from './NFT3Model'

export interface FollowModel {
  following_did: string
}

export interface FollowMember {
  identifier: string
  name: string
  avatar: string
  bio: string
}

export default class NFT3Follow {
  private model: NFT3Model<FollowModel>
  private client: NFT3Client

  constructor(client: NFT3Client) {
    this.client = client
    this.model = client.model('follow')
  }

  private async id2profile(identifiers: string[]) {
    const actions = identifiers.map(item => this.client.profile.info(item))
    const profiles = await Promise.all(actions)
    const users: FollowMember[] = profiles.map((item, i) => {
      return {
        identifier: identifiers[i],
        name: item?.name || '',
        avatar: item?.avatar || '',
        bio: item?.bio || ''
      }
    })
    return users
  }

  async count(identifier?: string) {
    identifier = identifier || this.client.did.identifier
    if (!identifier) throw new Error('identifier required')
    const [following, followers] = await Promise.all([
      this.model.count({
        identifier,
        count: {}
      }),
      this.model.count({
        count: {
          following_did: identifier
        }
      })
    ])
    return {
      following: following.count,
      followers: followers.count
    }
  }

  async following(options: {
    identifier?: string
    offset?: number
    limit?: number
  }) {
    const identifier = options.identifier || this.client.did.identifier
    if (!identifier) throw new Error('identifier required')
    const records = await this.model.find({
      ...options,
      query: {}
    })
    const ids = records.map(item => item.following_did)
    const users = await this.id2profile(ids)
    return users
  }

  async followers(options: {
    identifier?: string
    offset?: number
    limit?: number
  }) {
    const identifier = options.identifier || this.client.did.identifier
    if (!identifier) throw new Error('identifier required')
    const records = await this.model.find({
      query: {
        following_did: options.identifier
      },
      offset: options.offset,
      limit: options.limit
    })
    const ids = records.map(item => item.__owner)
    const users = await this.id2profile(ids)
    return users
  }

  async follow(identifier: string) {
    if (!this.client.did.identifier) throw new Error('authentication required')
    if (identifier === this.client.did.identifier) {
      throw new Error('invalid identifier')
    }
    const record = await this.model.findOne({
      identifier: this.client.did.identifier,
      query: {
        following_did: identifier
      }
    })
    if (record !== undefined) {
      throw new Error('followed already')
    }
    const result = await this.model.insertOne({
      following_did: identifier
    })
    return result
  }

  async unfollow(identifier: string) {
    if (!this.client.did.identifier) throw new Error('authentication required')
    const record = await this.model.findOne({
      identifier: this.client.did.identifier,
      query: {
        following_did: identifier
      }
    })
    if (!record) throw new Error('record not found')
    const result = await this.model.deleteOne(record.dataId)
    return result
  }

  async check(identifier: string, followingDid: string) {
    const record = await this.model.findOne({
      identifier,
      query: {
        following_did: followingDid
      }
    })
    return record !== undefined
  }
}
