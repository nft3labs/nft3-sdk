import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  NFT3Queryer,
  TokenRecord,
  OpenseaAssetsRecord,
  TxRecord,
  ENSRecord,
  TimelineRecord
} from '@nft3sdk/client'

export default function useAssets(identifier: string) {
  const [nfts, setNfts] = useState<OpenseaAssetsRecord[]>([])
  const [tokens, setTokens] = useState<TokenRecord[]>([])
  const [txs, setTxs] = useState<TxRecord[]>([])
  const [ens, setEns] = useState<ENSRecord[]>([])
  const [timeline, setTimeline] = useState<TimelineRecord[]>([])

  const queryer = useMemo(() => {
    return new NFT3Queryer('http://t0.onebitdev.com:10001/')
  }, [])

  const listAssets = useCallback(async () => {
    if (!identifier) {
      setTokens([])
      setNfts([])
      setTxs([])
      return
    }
    const data = await queryer.query({
      tokens: {
        did: identifier
      },
      poaps: {
        did: identifier
      },
      txs: {
        did: identifier
      },
      ens: {
        did: identifier
      },
      timeline: {
        did: identifier
      }
    })
    setTokens(data.tokens)
    setEns(data.ens)
    setTimeline(data.timeline)
  }, [identifier, queryer])

  const openseaAssets = useCallback(
    async (owner: string) => {
      const result = await queryer.openseaAssets({
        owner,
        limit: 30
      })
      setNfts(result.assets)
    },
    [queryer]
  )

  useEffect(() => {
    listAssets()
  }, [listAssets])

  return {
    tokens,
    nfts,
    txs,
    ens,
    timeline,
    openseaAssets
  }
}
