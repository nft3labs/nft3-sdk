import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, List, Link, Modal, Form, Input, Message } from '@arco-design/web-react'
import { IconPlus } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import useSocial, { SocialRecord } from '@hooks/useSocial'

export default function Socials() {
  const navigate = useNavigate()
  const [account, setAccount] = useState('')
  const [visible, setVisible] = useState(false)
  const { socials, list, removeAccount } = useSocial()

  const accountInfo = (item: SocialRecord) => {
    if (item.type === 'twitter') {
      return {
        type: 'Twitter',
        link: `https://twitter.com/${item.account}`
      }
    }
  }

  const onRemove = async (dataId: string) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to remove this account?',
      onOk: async () => {
        await removeAccount(dataId)
        Message.success('Account removed')
      }
    })
  }

  useEffect(() => {
    setAccount('')
  }, [visible])

  useEffect(() => {
    list()
  }, [list])

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Social accounts</div>
      <div className={styles.toolbar}>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={<IconPlus />}
          onClick={() => setVisible(true)}
        >
          Add Twitter
        </Button>
      </div>
      <List
        dataSource={socials}
        className={styles.list}
        render={(item, i) => (
          <List.Item
            key={i}
            actions={[
              <Button
                type="outline"
                shape="round"
                status="danger"
                onClick={() => onRemove(item.dataId)}
              >
                Delete
              </Button>
            ]}
          >
            <List.Item.Meta
              title={
                <div className={styles.type}>{accountInfo(item)?.type}</div>
              }
              description={
                <Link href={accountInfo(item)?.link} target="_blank">
                  {item.account}
                </Link>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title="Add Twitter"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button type="text" key="cancel" onClick={() => setVisible(false)}>
            Cancel
          </Button>,
          <Button
            type="primary"
            key="confirm"
            onClick={() => {
              navigate('/home/add-twitter/' + account)
              setVisible(false)
            }}
            disabled={!account.trim()}
          >
            Confirm
          </Button>
        ]}
      >
        <Form layout="vertical" size="large">
          <Form.Item>
            <Input
              prefix="https://twitter.com/"
              value={account}
              onChange={value => {
                setAccount(value)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
