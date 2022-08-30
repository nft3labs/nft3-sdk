/// <reference types="react-scripts" />

declare const ethereum: any
declare const solana: {
  [propName: string]: any
  isConnected: boolean
  publicKey: string
  isPhantom: boolean
  connect: () => Promise<any>
  disconnect: () => Promise<void>
}
