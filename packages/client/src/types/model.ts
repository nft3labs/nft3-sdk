export type NetworkType = 'ethereum' | 'solana'

export interface NFT3Wallet {
  network: NetworkType
  signMessage: (
    message: string
  ) => Promise<{
    publicKey: string
    signature: string
    signatureBuffer: Uint8Array
  }>
}
