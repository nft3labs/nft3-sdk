import {
  createContext,
  Context,
  PropsWithChildren,
  useState,
  useCallback,
  useContext,
  useMemo,
  useEffect
} from 'react'
import { NFT3Client } from '@nft3sdk/client'

import EthereumWallet from '../libs/EthereumWallet'
import SolanaWallet from '../libs/SolanaWallet'
import { NetworkType, WalletType, IWallet } from '../libs/types'
import WalletSelect from '../components/WalletSelect'
import NFT3Register from '../components/NFT3Register'

type NFT3Theme = 'light' | 'dark'

interface LoginResult {
  result: boolean
  needRegister: boolean
  identifier?: string
}

interface NFT3Context {
  account?: string
  client: NFT3Client
  didname?: string
  ready?: boolean
  theme: NFT3Theme
  identifier?: string
  connect: () => void
  login: () => Promise<LoginResult>
  register: (didname: string) => Promise<string>
  logout: () => void
  checkLogin: () => Promise<string | undefined>
  eagerConnect: () => void
  disconnect: () => void
  selectWallet: (wallet: WalletType) => Promise<string>
}

interface IContexts {
  value: Context<NFT3Context> | null
}

const context: IContexts = {
  value: null
}

function useWebNFT3(endpoint: string) {
  const [ready, setReady] = useState(false)
  const [account, setAccount] = useState<string>()
  const [wallet, setWallet] = useState<WalletType>()
  const [network, setNetwork] = useState<NetworkType>()
  const [nft3Wallet, setNft3Wallet] = useState<IWallet>()
  const [selectVisible, setSelectVisible] = useState(false)
  const [needRegister, setNeedRegister] = useState(false)
  const [identifier, setIdentifier] = useState<string>()

  const connect = useCallback(async () => {
    setSelectVisible(true)
  }, [])

  const client = useMemo(() => {
    return new NFT3Client(endpoint)
  }, [endpoint])

  const didname = useMemo(() => {
    if (!identifier) return undefined
    const arr = identifier.split(':')
    return arr[arr.length - 1] + '.isme'
  }, [identifier])

  useEffect(() => {
    const sessionKey = sessionStorage.getItem('sessionKey') || undefined
    if (nft3Wallet?.network === 'Ethereum') {
      const signer = nft3Wallet?.provider?.getSigner()
      client.did.config({
        network: 'ethereum',
        signer,
        signKey: sessionKey
      })
    }
    if (nft3Wallet?.network === 'Solana') {
      client.did.config({
        network: 'solana',
        signer: nft3Wallet?.provider,
        signKey: sessionKey
      })
    }
  }, [nft3Wallet, client])

  // DID register
  const register = useCallback(
    async (identifier: string) => {
      const result = await client.did?.register(identifier)
      setReady(true)
      return result.identifier
    },
    [client]
  )

  // DID login
  const login = useCallback(async () => {
    const result: LoginResult = await client.did.login()
    setIdentifier(result.identifier)
    if (client.did.signKey) {
      sessionStorage.setItem('sessionKey', client.did.signKey)
    }
    setNeedRegister(result.needRegister)
    return result
  }, [client])

  // DID logout
  const logout = useCallback(() => {
    setIdentifier(undefined)
    sessionStorage.removeItem('sessionKey')
    client.did.logout()
  }, [client.did])

  // check did login status
  const checkLogin = useCallback(async () => {
    try {
      if (!client.did || !client.did.signer) return
      const result = await client.did?.checkLogin()
      setIdentifier(result.identifier)
      return result.identifier
    } catch (error) {
      console.trace(error)
    } finally {
      setReady(true)
    }
  }, [client])

  useEffect(() => {
    if (account) checkLogin()
  }, [checkLogin, account])

  // select a wallet
  const selectWallet = async (type: WalletType, silent = false) => {
    let wallet: IWallet
    if (type === 'MetaMask') {
      wallet = new EthereumWallet('MetaMask')
    } else if (type === 'Phantom') {
      wallet = new SolanaWallet('Phantom')
    } else {
      throw new Error('Invalid wallet type')
    }
    await wallet.connect(silent)
    localStorage.setItem('wallet', type)
    wallet.onAccountChanged((accounts: string[]) => {
      setAccount(accounts[0] || undefined)
    })
    wallet.onDisconnect(() => {
      setAccount(undefined)
    })
    setWallet(type)
    setNft3Wallet(wallet)
    setAccount(wallet.account || undefined)
    return wallet.account!
  }

  // eager connect wallet
  const eagerConnect = useCallback(async () => {
    const wallet = localStorage.getItem('wallet') as WalletType
    if (wallet === 'Phantom' || wallet === 'MetaMask') {
      selectWallet(wallet, true)
    }
  }, [])

  return {
    wallet,
    network,
    nft3Wallet,
    account,
    selectVisible,
    client,
    didname,
    identifier,
    ready,
    needRegister,
    selectWallet,
    setAccount,
    setSelectVisible,
    setNeedRegister,
    setNft3Wallet,
    connect,
    login,
    logout,
    checkLogin,
    register,
    setWallet,
    setNetwork,
    eagerConnect
  }
}

function createNFT3Context() {
  context.value = createContext<NFT3Context>({
    client: new NFT3Client(''),
    account: undefined,
    didname: undefined,
    theme: 'light',
    connect: () => {},
    eagerConnect: () => {},
    disconnect: () => {},
    logout: () => {},
    checkLogin: () => Promise.resolve(undefined),
    login: () =>
      Promise.resolve({
        result: false,
        needRegister: false,
        identifier: undefined
      }),
    register: () => Promise.resolve(''),
    selectWallet: () => Promise.resolve('')
  })
  const Provider = context.value.Provider

  return function useNFT3Provider(
    props: PropsWithChildren<{
      endpoint: string
      theme?: NFT3Theme
      silent?: boolean
    }>
  ) {
    const theme = props.theme || 'light'
    const {
      account,
      selectVisible,
      nft3Wallet,
      client,
      didname,
      ready,
      identifier,
      needRegister,
      selectWallet,
      connect,
      setAccount,
      register,
      login,
      logout,
      checkLogin,
      setSelectVisible,
      setNeedRegister,
      eagerConnect
    } = useWebNFT3(props.endpoint)

    const disconnect = async () => {
      nft3Wallet?.disconnect()
      setAccount(undefined)
      localStorage.removeItem('wallet')
    }

    return (
      <Provider
        value={{
          account,
          client,
          didname,
          ready,
          theme,
          identifier,
          login,
          logout,
          register,
          checkLogin,
          eagerConnect,
          connect,
          disconnect,
          selectWallet
        }}
      >
        {props.children}
        {props.silent !== true && (
          <>
            <WalletSelect
              visible={selectVisible}
              onClose={wallet => {
                if (wallet) selectWallet(wallet)
                setSelectVisible(false)
              }}
            />
            <NFT3Register
              visible={needRegister}
              onClose={() => setNeedRegister(false)}
            />
          </>
        )}
      </Provider>
    )
  }
}

export const NFT3Provider = createNFT3Context()
export function useNFT3() {
  return useContext(context.value!)
}
