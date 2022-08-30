import { useCallback, useEffect, useMemo, useState } from 'react'
import { NFT3Queryer, TokenRecord } from '@nft3sdk/client'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function useAssets() {
  const [tokens, setTokens] = useState<TokenRecord[]>([])
  const { identifier } = useNFT3()

  const queryer = useMemo(() => {
    return new NFT3Queryer('http://t0.onebitdev.com:10001/')
  }, [])

  const getTokens = useCallback(async () => {
    if (!identifier) {
      setTokens([])
      return
    }
    const data = await queryer.query({
      tokens: {
        did: identifier
      }
    })
    setTokens(data.tokens)
  }, [identifier, queryer])

  useEffect(() => {
    getTokens()
  }, [getTokens])

  return {
    tokens
  }
}
