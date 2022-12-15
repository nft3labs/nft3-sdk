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

export interface ENSTextRecord {
  snapshot: string
  email: string
  'eth.ens.delegate': string
  'vnd.github': string
  'org.telegram': string
  'com.linkedin': string
  'VND.TELEGRAM': string
  'com.reddit': string
  'com.github': string
  header: string
  'vnd.telegram': string
  'com.discord': string
  description: string
  'vnd.twitter': string
  'com.twitter': string
  url: string
  name: string
  keywords: string
  location: string
  avatar: string
  notice: string
  ensName: string
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
  ens?: {
    did?: string
    address?: string
  }
  timeline?: Pick<QueryParams, 'did' | 'limit' | 'offset'>
  ensTextRecords?: {
    address: string
  }
  nft3Featured?: {
    offset?: number
    limit?: number
  }
  nft3Stats?: {}
}

export interface QueryResponse {
  tokens: TokenRecord[]
  txs: TxRecord[]
  nfts: NFTRecord[]
  poaps: POAPRecord[]
  ens: ENSRecord[]
  timeline: TimelineRecord[]
  ensTextRecords: ENSTextRecord[]
  nft3Featured: FeaturedRecord[]
  nft3Stats: NFT3Stats
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
  collection: {
    name: string
    [propName: string]: any
  }
  [propName: string]: any
}

export interface OpenseaAssetsResponse {
  next: string | null
  previous: string | null
  assets: OpenseaAssetsRecord[]
}

export interface FeaturedRecord {
  did: string
  followers: number
  profile: {
    name: string
    bio: string
    avatar: string
  }
}

export interface NFT3Stats {
  dids: number
  followings: number
  socials: number
  unclaims: number
}

export default class NFT3Queryer {
  private request: AxiosInstance

  constructor(endpoint: string) {
    this.request = axios.create({
      baseURL: endpoint.replace(/\/$/, '')
    })
  }

  private nft3StatsQuery() {
    const query = `nft3Stats {
      dids
      followings
      socials
      unclaims
    }`
    return {
      query,
      vars: '',
      params: {}
    }
  }

  private nft3FeaturedQuery(options: { offset?: number; limit?: number }) {
    const query = `nft3Featured(offset: $featuredOffset, limit: $featuredLimit) {
      did
      followers
      profile
    }`
    const vars = `$featuredOffset: Int!, $featuredLimit: Int!`
    const params = {
      featuredOffset: options.offset || 0,
      featuredLimit: options.limit || 10
    }
    return {
      query,
      vars,
      params
    }
  }

  private ensTextRecordsQuery(options: { address: string }) {
    const query = `ensTextRecords(address: $ensTextRecordAddress) {
      items
    }`
    const vars = `$ensTextRecordAddress: String!`
    const params = {
      ensTextRecordAddress: options.address
    }
    return {
      query,
      vars,
      params
    }
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

  private ensQuery(options: any) {
    const query = `ens(did: $ensDid, address: $ensAddress) {
      name
      owner
    }`
    const vars = `$ensDid: String, $ensAddress: String`
    const params = {
      ensDid: options.did || null,
      ensAddress: options.address || null
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
      const method: any = Reflect.get(this, `${key}Query`)
      const { query, vars, params } = Reflect.apply(method, this, [
        options[key]
      ]) as any
      bodys.push(query)
      if (vars) querys.push(vars)
      variables = {
        ...variables,
        ...params
      }
    }
    const queryStr = querys.join(', ')
    let content = `query NFT3Query(${queryStr}) {
      ${bodys.join('\n')}
    }`
    if (querys.length === 0) {
      content = `query NFT3Query {
        ${bodys.join('\n')}
      }`
    }
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
      const ensRecords = data.data.ensTextRecords?.items
      if (ensRecords) {
        data.data.ensTextRecords = ensRecords
      }
      const nft3Featured = data.data.nft3Featured
      if (nft3Featured) {
        const items = nft3Featured.map((item: any) => {
          const profile = {
            name: item.profile.name,
            bio: item.profile.bio,
            avatar: item.profile.avatar
          }
          return {
            did: item.did,
            followers: Number(item.followers),
            profile
          }
        })
        data.data.nft3Featured = items
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
