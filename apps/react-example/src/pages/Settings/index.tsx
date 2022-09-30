import { useEffect, useRef, useState } from 'react'
import {
  Form,
  Button,
  Input,
  FormInstance,
  Message
} from '@arco-design/web-react'

import styles from './style.module.scss'
import useSetting from '@hooks/useSetting'
import ImageUpload from '@components/ImageUpload'

export default function Settings() {
  const form = useRef<FormInstance>(null)
  const [loading, setLoading] = useState(false)
  const { profile, update } = useSetting()

  const onSave = async () => {
    const data = await form.current?.validate()
    try {
      setLoading(true)
      await update(data)
      Message.success('Profile successfully saved')
    } catch (error: any) {
      Message.error(error.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profile) {
      form.current?.setFieldsValue(profile)
    }
  }, [profile])

  return (
    <Form layout="vertical" size="large" className={styles.form} ref={form}>
      <Form.Item>
        <div className={styles.title}>Public profile</div>
      </Form.Item>
      <Form.Item field="avatar">
        <ImageUpload />
      </Form.Item>
      <Form.Item label="Name" field="name">
        <Input defaultValue='' />
      </Form.Item>
      <Form.Item label="Bio" field="bio">
        <Input.TextArea rows={5} />
      </Form.Item>
      <Form.Item label="URL" field="url">
        <Input />
      </Form.Item>
      <Form.Item label="Gender" field="gender">
        <Input />
      </Form.Item>
      <Form.Item label="Location" field="location">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={loading} onClick={onSave}>
          Update profile
        </Button>
      </Form.Item>
    </Form>
  )
}
