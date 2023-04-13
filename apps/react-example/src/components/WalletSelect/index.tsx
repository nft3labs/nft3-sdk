import { useRef, useEffect } from 'react'
import { Modal } from '@arco-design/web-react'

import styles from './style.module.scss'
import { ReactComponent as Phantom } from '@assets/phantom.svg'
import { ReactComponent as MetaMask } from '@assets/metamask.svg'
import { ReactComponent as AptosPetra } from '@assets/petra.svg'

type WalletType = 'MetaMask' | 'Phantom' | 'Petra'

interface Props {
  visible: boolean
  onClose: (wallet?: WalletType) => void
}

export default function WalletSelect({ visible, onClose }: Props) {
  const selected = useRef<WalletType>()

  const close = () => {
    onClose(selected.current)
  }

  const select = (wallet: WalletType) => {
    selected.current = wallet
    close()
  }

  useEffect(() => {
    selected.current = undefined
  }, [visible])

  return (
    <Modal
      title="Connect a wallet"
      visible={visible}
      footer={null}
      onCancel={close}
    >
      <div className={styles.grid}>
        <div className={styles.item} onClick={() => select('MetaMask')}>
          <span>MetaMask</span>
          <MetaMask className={styles.icon} />
        </div>
        <div className={styles.item} onClick={() => select('Phantom')}>
          <span>Solana Phantom</span>
          <Phantom className={styles.icon} />
        </div>
        <div className={styles.item} onClick={() => select('Petra')}>
          <span>Aptos Petra</span>
          <AptosPetra className={styles.icon} />
        </div>
      </div>
    </Modal>
  )
}
