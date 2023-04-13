import { useState, useEffect, useCallback } from 'react'
import { useNFT3 } from '@nft3sdk/did-manager'

interface AccountRecord {
  account: string
  network: string
}

export default function useWallet() {
  const { account, client, identifier } = useNFT3()
  const [accounts, setAccounts] = useState<AccountRecord[]>([])

  const list = useCallback(async () => {
    if (!identifier) return
    const result = await client.did.accounts()
    const accounts = result.map(item => {
      const arr = item.split(':')
      return {
        network: arr[0],
        account: arr[1]
      }
    })
    setAccounts(accounts)
  }, [client.did, identifier])

  const add = useCallback(async () => {
    await client.did.addKey()
    list()
  }, [client.did, list])

  const remove = useCallback(async () => {
    let network = ''
    for (const item of accounts) {
      if (item.account === account) {
        network = item.network
      }
    }
    await client.did.removeKey(network)
    list()
  }, [client.did, list, accounts, account])

  useEffect(() => {
    list()
  }, [list])

  return {
    accounts,
    add,
    remove
  }
}
