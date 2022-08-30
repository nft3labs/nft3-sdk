import { JSONSchema7Definition } from 'json-schema'
import NFT3Client from './NFT3Client'
import NFT3DID from './NFT3DID'

export default class NFT3Schema {
  private client: NFT3Client
  private did?: NFT3DID

  constructor(client: NFT3Client, did?: NFT3DID) {
    this.client = client
    this.did = did
  }

  /**
   * create NFT3Schema
   * @param options 
   * @returns 
   */
  async create(options: {
    name: string
    description: string
    schema: JSONSchema7Definition
  }) {
    if (!this.did) throw new Error('DID required')
    const result = await this.did.send<string>('nft3_model_create', {
      msg: {},
      name: options.name,
      description: options.description,
      schema: JSON.stringify(options.schema)
    })
    return {
      modelName: result
    }
  }

  /**
   * NFT3Schema info
   * @param name 
   * @returns 
   */
  async get(name: string) {
    const result = await this.client.send('nft3_model_info', {
      name
    })
    return result
  }
}
