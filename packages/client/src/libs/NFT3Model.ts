import NFT3Client from './NFT3Client'

export interface FindOptions {
  controller?: string
  query: Record<string, any>
  fields?: string[]
  offset?: number
  limit?: number
}

export type WithMeta<T> = T & {
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

  async find(options: FindOptions) {
    const params = {
      did: options.controller,
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

  async findOne(options: FindOptions) {
    const result = await this.find(options)
    return result[0] || null
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
    const result = await this.client.did.send('nft3_appdata_mutation', params)
    return {
      dataId: result
    }
  }
}
