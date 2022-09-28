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

export interface TimelineRecord {
  item: TxRecord | POAPRecord
  timestamp: string
  type: 'txs' | 'poaps'
}

export interface ENSRecord {
  name: string
  owner: string
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
  ens?: Pick<QueryParams, 'did'>
  timeline?: Pick<QueryParams, 'did' | 'limit' | 'offset'>
}

export interface QueryResponse {
  tokens: TokenRecord[]
  txs: TxRecord[]
  nfts: NFTRecord[]
  poaps: POAPRecord[]
  ens: ENSRecord[]
  timeline: TimelineRecord[]
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

  private tokensQuery(options: QueryParams) {
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
    const vars = `$tokensDid: String!, $tokensNetwork: String, $tokensOffset: Int, $tokensLimit: Int`
    const params = {
      tokensDid: options.did,
      tokensNetwork: options.network || null,
      tokensOffset: options.offset || 0,
      tokensLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private txsQuery(options: QueryParams) {
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
    const vars = `$txsDid: String!, $txsNetwork: String, $txsOffset: Int, $txsLimit: Int`
    const params = {
      txsDid: options.did,
      txsNetwork: options.network || null,
      txsOffset: options.offset || 0,
      txsLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private nftsQuery(options: QueryParams) {
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
    const vars = `$nftsDid: String!, $nftsNetwork: String, $nftsOffset: Int, $nftsLimit: Int`
    const params = {
      nftsDid: options.did,
      nftsNetwork: options.network || null,
      nftsOffset: options.offset || 0,
      nftsLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private poapsQuery(options: QueryParams) {
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
    const vars = `$poapsDid: String!, $poapsNetwork: String, $poapsOffset: Int, $poapsLimit: Int`
    const params = {
      poapsDid: options.did,
      poapsNetwork: options.network || null,
      poapsOffset: options.offset || 0,
      poapsLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private ensQuery(options: QueryParams) {
    const query = `ens(did: $ensDid) {
      name
      owner
    }`
    const vars = `$ensDid: String!`
    const params = {
      ensDid: options.did
    }
    return {
      query,
      vars,
      params
    }
  }

  private timelineQuery(options: QueryParams) {
    const query = `timeline(did: $timelineDid, offset: $timelineOffset, limit: $timelineLimit) {
      item {
        ... on POAP {
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
        }
        ... on Transaction {
          network
          symbol
          hash
          from
          to
          amount
          blocknum
          timestamp
          contract
        }
      }
      timestamp
      type
    }`
    const vars = `$timelineDid: String!, $timelineOffset: Int, $timelineLimit: Int`
    const params = {
      timelineDid: options.did,
      timelineOffset: options.offset || 0,
      timelineLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private buildQuery(options: QueryOptions) {
    const keys = Object.keys(options)
    const querys: string[] = []
    const bodys = []
    let variables: any = {}
    for (const key of keys) {
      const method = Reflect.get(this, `${key}Query`)
      const { query, vars, params } = Reflect.apply(method, this, [options[key]])
      bodys.push(query)
      querys.push(vars)
      variables = {
        ...variables,
        ...params
      }
    }
    const queryStr = querys.join(', ')
    const content = `query NFT3Query(${queryStr}) {
      ${bodys.join('\n')}
    }`
    return {
      query: content,
      variables
    }
  }

  async query<T extends keyof QueryOptions>(
    options: Pick<QueryOptions, T>
  ): Promise<Pick<QueryResponse, T>> {
    try {
      const { query, variables } = this.buildQuery(options)
      const operationName = 'NFT3Query'
      const { data } = await this.request.post('/', {
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
