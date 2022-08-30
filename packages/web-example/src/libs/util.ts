export function formatUrl(link?: string) {
  link = link || ''
  try {
    const url = new URL(link)
    if (url.protocol === 'ipfs:') {
      const key = url.pathname.replace(/^\/\//, '')
      return `https://infura-ipfs.io/ipfs/${key}`
    }
    return link
  } catch (error) {
    return undefined
  }
}