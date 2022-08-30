import { Button, Space } from '@arco-design/web-react'

import styles from './style.module.scss'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function Header() {
  const { account, didname, ready, login, connect } = useNFT3()

  const renderBtn = () => {
    if (!account) {
      return (
        <Button type="primary" shape="round" size="large" onClick={connect}>
          Connect Wallet
        </Button>
      )
    }
    if (!ready) return null
    if (!didname) {
      return (
        <Button type="primary" shape="round" size="large" onClick={login}>
          Login NFT3
        </Button>
      )
    } else {
      return (
        <Button type="outline" shape="round" size="large">
          {didname}
        </Button>
      )
    }
  }

  return (
    <header className={styles.header}>
      <span>NFT3 SDK Demo</span>
      <Space>{renderBtn()}</Space>
    </header>
  )
}
