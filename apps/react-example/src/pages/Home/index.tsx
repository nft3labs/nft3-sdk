import { Outlet } from 'react-router-dom'
import { useNFT3 } from '@nft3sdk/did-manager'

import styles from './style.module.scss'

export default function Home() {
  const { identifier } = useNFT3()

  if (!identifier) {
    return <div className={styles.tip}>Please login first</div>
  }

  return <Outlet />
}
