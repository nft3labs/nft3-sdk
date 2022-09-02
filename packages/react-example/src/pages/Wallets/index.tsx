import { useMemo, useState } from 'react'
import { Button, List, Message } from '@arco-design/web-react'
import { useNFT3 } from '@nft3sdk/did-manager'
import { IconPlus, IconClose } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import useWallet from '@hooks/useWallet'

export default function Wallets() {
  const { accounts, add, remove } = useWallet()
  const { account } = useNFT3()
  const [loading, setLoading] = useState(false)

  const onAdd = async () => {
    try {
      setLoading(true)
      await add()
      Message.success('Wallet added')
    } catch (error: any) {
      Message.error(error.message || 'Added failed')
    } finally {
      setLoading(false)
    }
  }

  const onRemove = async () => {
    try {
      setLoading(true)
      await remove()
      Message.success('Wallet removed')
    } catch (error: any) {
      Message.error(error.message || 'Remove failed')
    } finally {
      setLoading(false)
    }
  }

  const added = useMemo(() => {
    const index = accounts.findIndex(
      item => item.account.toLowerCase() === account?.toLowerCase() && account
    )
    return index > -1
  }, [accounts, account])

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Wallets</div>
      <List
        dataSource={accounts}
        className={styles.list}
        render={(item, i) => (
          <List.Item key={i} actions={[<span>{item.network}</span>]}>
            <List.Item.Meta
              title={<div className={styles.type}>{item.account}</div>}
            />
          </List.Item>
        )}
      />
      <div className={styles.bottom}>
        <div className={styles.current}>{account}</div>
        {added ? (
          <Button
            type="primary"
            status="danger"
            size="large"
            shape="round"
            disabled={accounts.length <= 1}
            loading={loading}
            onClick={onRemove}
            icon={<IconClose />}
          >
            Remove this wallet
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={onAdd}
            loading={loading}
            icon={<IconPlus />}
          >
            Add this wallet
          </Button>
        )}
      </div>
    </div>
  )
}
