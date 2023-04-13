declare const ethereum: any
declare const solana: {
  [propName: string]: any
  isConnected: boolean
  publicKey: string
  isPhantom: boolean
  connect: () => Promise<any>
  disconnect: () => Promise<void>
}
declare const aptos: {
  [propName: string]: any
  account: () => Promise<{ publicKey: string }>
  signMessage: (params: {
    message: string
    nonce: string
  }) => Promise<{ signature: string; fullMessage: string }>
}
declare module '*.svg' {
  const src: string
  export default src
}
