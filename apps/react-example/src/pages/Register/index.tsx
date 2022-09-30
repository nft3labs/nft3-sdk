import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, Message, FormInstance } from '@arco-design/web-react'
import { useNFT3 } from '@nft3sdk/did-manager'

import styles from './style.module.scss'

export default function Register() {
  const navigate = useNavigate()
  const form = useRef<FormInstance>(null)
  const [loading, setLoading] = useState(false)
  const { register } = useNFT3()

  const onRegister = async () => {
    const { username } = await form.current?.validate()
    try {
      setLoading(true)
      const identifier = await register(username)
      if (identifier) {
        navigate('/')
        Message.success('DID created')
      }
    } catch (error) {
      console.trace(error)
      Message.error('Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form className={styles.wrap} layout="vertical" size="large" ref={form}>
      <Form.Item>
        <div className={styles.title}>Create your DID</div>
      </Form.Item>
      <Form.Item
        field="username"
        rules={[
          {
            required: true,
            message: 'Please input your username'
          },
          {
            validator: (value, cb) => {
              if (/^[a-z0-9_]{3,15}$/i.test(value) === false) {
                cb('Invalid username')
              } else {
                cb()
              }
            }
          }
        ]}
      >
        <Input placeholder="Username" suffix=".isme" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          long
          onClick={onRegister}
          loading={loading}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}
