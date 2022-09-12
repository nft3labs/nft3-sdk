import dayjs from 'dayjs'

export function formatDate(time: number) {
  return dayjs(time).format('MMMM DD, YYYY')
}

export function browser(network: string) {
  switch (network) {
    case 'polygon':
      return 'https://polygonscan.com'
    case 'optimism':
      return 'https://optimistic.etherscan.io'
    case 'binance-smart-chain':
      return 'https://www.bscscan.com'
    case 'fantom':
      return 'https://ftmscan.com'
    case 'arbitrum':
      return 'https://arbiscan.io'
    case 'celo':
      return 'https://explorer.celo.org'
    case 'moonriver':
      return 'https://moonriver.moonscan.io'
    default:
      return 'https://etherscan.io'
  }
}