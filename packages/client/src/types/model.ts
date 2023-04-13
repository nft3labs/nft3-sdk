export type NetworkType =
  | 'ethereum'
  | 'solana'
  | 'polygon'
  | 'bnb'
  | 'arb'
  | 'op'
  | 'aptos'

export interface NFT3Wallet {
  network: NetworkType
  signMessage: (message: string) => Promise<{
    nonce?: string
    publicKey: string
    signature: string
    signatureBuffer: Uint8Array
  }>
}
