import NFT3Client from './NFT3Client'

export interface FindOptions<T = any> {
  identifier?: string
  query: Partial<T> & { dataid?: string }
  fields?: string[]
  offset?: number
  limit?: number
}

export interface CountOptions<T = any> {
  identifier?: string
  count: Partial<T>
}

export type WithMeta<T> = T & {
  __owner: string
  createdAt: number
  updatedAt: number
  dataId: string
}

export default class NFT3Model<T = any> {
  private client: NFT3Client
  modelId: string

  constructor(
    client: NFT3Client,
    modelId: string
  ) {
    this.client = client
    this.modelId = modelId
  }

  async find(options: FindOptions<T>) {
    const params = {
      did: options.identifier,
      modelid: this.modelId,
      query: options.query,
      offset: options.offset || 0,
      limit: options.limit || 10
    }
    const result = await this.client.send('nft3_appdata_query', params)
    const items: WithMeta<T>[] = result.items.map((item: any) => {
      item.dataId = item.dataid
      item.createdAt = item.created_at
      item.updatedAt = item.updated_at
      delete item._id
      delete item.dataid
      delete item.created_at
      delete item.updated_at
      return item
    })
    return items
  }

  async findOne(options: FindOptions<T>) {
    const result = await this.find(options)
    return result[0] || undefined
  }

  async insertOne(data: T) {
    const params = {
      msg: {},
      modelid: this.modelId,
      insert: data
    }
    const dataId: string = await this.client.did.send(
      'nft3_appdata_mutation',
      params
    )
    return {
      dataId
    }
  }

  async updateOne(dataId: string, data: T) {
    const params = {
      msg: {},
      modelid: this.modelId,
      dataid: dataId,
      update: data
    }
    await this.client.did.send('nft3_appdata_mutation', params)
    return {
      dataId
    }
  }

  async deleteOne(dataId: string) {
    const params = {
      msg: {},
      modelid: this.modelId,
      dataid: dataId,
      remove: true
    }
    await this.client.did.send('nft3_appdata_mutation', params)
    return {
      dataId
    }
  }

  async count(options: CountOptions<T>) {
    const params = {
      did: options.identifier,
      modelid: this.modelId,
      count: options.count
    }
    const result = await this.client.send('nft3_appdata_query', params)
    return {
      count: result.count as number
    }
  }
}
