import { useState, useEffect, useCallback } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function useWallet() {
  const { client, identifier } = useNFT3()
  const [accounts, setAccounts] = useState<string[]>([])

  const list = useCallback(async () => {
    if (!identifier) return
    const result = await client.did.accounts()
    const accounts = result.map(item => {
      const arr = item.split(':')
      if (arr[0] === 'ethereum') return '0x' + arr[1]
      return item
    })
    setAccounts(accounts)
  }, [client.did, identifier])

  const add = useCallback(async () => {
    await client.did.addKey()
    list()
  }, [client.did, list])

  const remove = useCallback(async () => {
    await client.did.removeKey()
    list()
  }, [client.did, list])

  useEffect(() => {
    list()
  }, [list])

  return {
    accounts,
    add,
    remove
  }
}
