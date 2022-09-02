import axios, { AxiosInstance } from 'axios'
import { formatUnits } from '@ethersproject/units'

export interface TokenRecord {
  network: string
  symbol: string
  decimals: number
  balance: number
  balanceUSD: number
  owner: string
  contract: string
  price: number
  icon: string
}

export interface TxRecord {
  network: string
  symbol: string
  from: string
  to: string
  hash: string
  amount: string
  blocknum: number
  timestamp: string
  contract: string
}

export interface NFTRecord {
  network: string
  owner: string
  tokenid: string
  contract: string
  image_url: string
  name: string
  description: string
  token_standard: string
}

export interface POAPEvent {
  id: number
  fancy_id: string
  name: string
  event_url: string
  image_url: string
  country: string
  city: string
  description: string
  year: number
  start_date: string
  end_date: string
  expiry_date: string
  supply: number
}

export interface POAPRecord {
  tokenId: string
  owner: string
  network: string
  created: string
  event: POAPEvent
}

export interface QueryParams {
  did: string
  network?: string
  offset?: number
  limit?: number
}

export interface QueryOptions {
  tokens?: QueryParams
  txs?: QueryParams
  poaps?: QueryParams
}

export interface QueryResponse {
  tokens: TokenRecord[]
  txs: TxRecord[]
  nfts: NFTRecord[]
  poaps: POAPRecord[]
}

export interface OpenseaAssetsOptions {
  owner: string
  limit: number
  cursor?: string
}

export interface OpenseaAssetsRecord {
  id: number
  image_url: string
  image_preview_url: string
  permalink: string
  name: string
  description: string
  asset_contract: {
    contract: string
    symbol: string
  }
  token_id: string
}

export interface OpenseaAssetsResponse {
  next: string | null
  previous: string | null
  assets: OpenseaAssetsRecord[]
}

export default class NFT3Queryer {
  private request: AxiosInstance

  constructor(endpoint: string) {
    this.request = axios.create({
      baseURL: endpoint.replace(/\/$/, '')
    })
  }

  private tokensQuery() {
    const query = `tokens(did: $tokensDid, network: $tokensNetwork, offset: $tokensOffset, limit: $tokensLimit) {
    network
    symbol
    decimals
    balance
    owner
    contract
    price
    icon
  }`
    return query
  }

  private txsQuery() {
    const query = `txs(did: $txsDid, network: $txsNetwork, offset: $txsOffset, limit: $txsLimit) {
    network
    symbol
    from
    to
    hash
    amount
    blocknum
    timestamp
    contract
  }`
    return query
  }

  private nftsQuery() {
    const query = `nfts(did: $nftsDid, network: $nftsNetwork, offset: $nftsOffset, limit: $nftsLimit) {
    network
    owner
    tokenid
    contract
    image_url
    name
    description
    token_standard
  }`
    return query
  }

  private poapsQuery() {
    const query = `poaps(did: $poapsDid, network: $poapsNetwork, offset: $poapsOffset, limit: $poapsLimit) {
    tokenId
    owner
    network
    created
    event {
      id
      fancy_id
      name
      event_url
      image_url
      country
      city
      description
      year
      start_date
      end_date
      expiry_date
      supply
    }
  }`
    return query
  }

  private buildVars(options: QueryOptions) {
    const vars: any = {}
    const keys = Object.keys(options)
    for (const key of keys) {
      vars[`${key}Did`] = options[key].did
      vars[`${key}Network`] = options[key].network || null
      vars[`${key}Offset`] = options[key].offset || 0
      vars[`${key}Limit`] = options[key].limit || 10
    }
    return vars
  }

  private buildQuery(options: QueryOptions) {
    const keys = Object.keys(options)
    let query: string[] = []
    let body = []
    for (const key of keys) {
      query = query.concat([
        `$${key}Did: String!`,
        `$${key}Network: String`,
        `$${key}Offset: Int`,
        `$${key}Limit: Int`
      ])
      const method = Reflect.get(this, `${key}Query`)
      body.push(Reflect.apply(method, this, []))
    }
    const queryStr = query.join(', ')
    const content = `query NFT3Query(${queryStr}) {
      ${body.join('\n')}
    }`
    return content
  }

  async query<T extends keyof QueryOptions>(
    options: Pick<QueryOptions, T>
  ): Promise<Pick<QueryResponse, T>> {
    try {
      const query = this.buildQuery(options)
      const variables = this.buildVars(options)
      const operationName = 'NFT3Query'
      const { data } = await this.request.post('/gql', {
        operationName,
        query,
        variables
      })
      const tokens = data.data.tokens
      if (tokens) {
        for (const token of tokens) {
          token.balance = Number(formatUnits(token.balance, token.decimals))
          token.balanceUSD = token.price * token.balance
        }
      }
      return data.data
    } catch (error) {
      console.trace(error)
    }
  }

  /**
   * list opensea assets, available in browser only
   * @param options 
   * @returns 
   */
  async openseaAssets(options: OpenseaAssetsOptions) {
    let limit = options.limit
    if (limit < 0) limit = 10
    if (limit > 50) limit = 50
    const params = new URLSearchParams()
    params.set('owner', options.owner)
    params.set('limit', limit.toString())
    if (options.cursor) params.set('cursor', options.cursor)
    const url = `https://api.opensea.io/api/v1/assets?${params.toString()}`
    const { data } = await axios.get<OpenseaAssetsResponse>(url)
    return data
  }
}
