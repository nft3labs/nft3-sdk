import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Message } from '@arco-design/web-react'

import styles from './style.module.scss'
import useSocial from '@hooks/useSocial'

export default function AddTwitter() {
  const { account } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { requestTwitter, verifyTwitter, addTwitter } = useSocial()
  const [info, setInfo] = useState<{
    link: string
    text: string
    msghash: string
  }>()

  const request = () => {
    const info = requestTwitter()
    setInfo(info)
    Message.success('Load successfully')
  }

  const verify = async () => {
    try {
      setLoading(true)
      const verify = await verifyTwitter(account!, info!.msghash)
      if (verify.result === false) {
        return Message.error('Verify failed')
      }
      await addTwitter({
        account: account!,
        type: 'twitter',
        proof: verify.proof,
        verifier_key: verify.verifier_key,
        msghash: info!.msghash
      })
      setInfo(undefined)
      navigate('/home/socials')
      Message.success('Account added')
    } catch (error: any) {
      Message.error(error.message || 'Verify failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Add Twitter</div>
      <div className={styles.main}>
        <div className={styles.card}>
          <div className={styles.cardMain}>
            <div className={styles.cardTitle}>Step 1</div>
            <div className={styles.cardText}>
              Click this button to load the attestation challenge.
            </div>
          </div>
          <div className={styles.cardBtn}>
            <Button type="primary" onClick={request}>
              Load
            </Button>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardMain}>
            <div className={styles.cardTitle}>Step 2</div>
            <div className={styles.cardText}>
              Tweet a verification from
              <span className={styles.red}>{account}</span>
            </div>
          </div>
          <div className={styles.cardBtn}>
            <Button
              type="primary"
              onClick={() => window.open(info?.link)}
              disabled={!info}
            >
              Open
            </Button>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardMain}>
            <div className={styles.cardTitle}>Step 3</div>
            <div className={styles.cardText}>
              Return to this page and verify your account by clicking this
              button.
            </div>
          </div>
          <div className={styles.cardBtn}>
            <Button
              type="primary"
              onClick={verify}
              disabled={!info}
              loading={loading}
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
