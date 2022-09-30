import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  NFT3Queryer,
  TokenRecord,
  OpenseaAssetsRecord,
  TxRecord,
  ENSRecord,
  TimelineRecord,
  ENSTextRecord,
  POAPRecord
} from '@nft3sdk/client'

export default function useAssets(identifier: string) {
  const [nfts, setNfts] = useState<OpenseaAssetsRecord[]>([])
  const [tokens, setTokens] = useState<TokenRecord[]>([])
  const [txs, setTxs] = useState<TxRecord[]>([])
  const [ens, setEns] = useState<ENSRecord[]>([])
  const [poaps, setPoaps] = useState<POAPRecord[]>([])
  const [timeline, setTimeline] = useState<TimelineRecord[]>([])
  const [ensRecords, setEnsRecords] = useState<ENSTextRecord[]>([])

  const queryer = useMemo(() => {
    return new NFT3Queryer('https://t0.onebitdev.com/nft3-queryer/')
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
      },
      ensTextRecords: {
        address: '0x983110309620D911731Ac0932219af06091b6744'
      }
    })
    setTokens(data.tokens)
    setTxs(data.txs)
    setEns(data.ens)
    setTimeline(data.timeline)
    setEnsRecords(data.ensTextRecords)
    setPoaps(data.poaps)
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
    poaps,
    timeline,
    ensRecords,
    openseaAssets
  }
}
