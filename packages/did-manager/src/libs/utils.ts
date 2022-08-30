export function utf82hex(text: string) {
  const buf = new TextEncoder().encode(text)
  let result = ''
  for (let i = 0; i < buf.length; i++) {
    const item = buf[i].toString(16).padStart(2, '0')
    result += item
  }
  return result
}

export function shortAddr(account: string, length = 4) {
  const isHex = account.startsWith('0x')
  return `${account.slice(0, isHex ? length + 2 : length)}...${account.slice(
    -length
  )}`
}
