import { useCallback, useEffect, useRef, useState } from 'react'
import { Message } from '@arco-design/web-react'
import { IconEdit, IconLoading } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import useIpfs from '@hooks/useIpfs'

interface Props {
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export default function ImageUpload(props: Props) {
  const btn = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [src, setSrc] = useState('')
  const { format, upload } = useIpfs()

  const onUpload = useCallback(
    async (file: File) => {
      try {
        if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name) !== true) {
          return Message.error('Invalid image type')
        }
        if (file.size > 1024 * 1024 * 2) {
          return Message.error('Image size limit 2MB')
        }
        setLoading(true)
        const result = await upload(file)
        if (result) {
          setSrc(result)
          if (props.onChange) {
            props.onChange(result)
          }
        } else {
          Message.error('Upload failed')
        }
      } catch (error: any) {
        Message.error(error.message)
      } finally {
        setLoading(false)
      }
    },
    [props]
  )

  useEffect(() => {
    if (props.value) setSrc(props.value)
  }, [props.value])

  useEffect(() => {
    const handle = () => {
      if (btn.current?.files) {
        const file = btn.current.files[0]
        onUpload(file)
      }
    }
    if (btn.current) {
      btn.current.onchange = handle
    }
  }, [onUpload])

  return (
    <div
      className={
        props.className ? styles.wrap + ' ' + props.className : styles.wrap
      }
    >
      {!!src && <img src={format(src)} className={styles.img} alt="" />}
      <div
        className={styles.mask}
        onClick={() => {
          if (!loading) btn.current?.click()
        }}
      >
        {loading ? <IconLoading /> : <IconEdit />}
      </div>
      <input type="file" className={styles.btn} ref={btn} />
    </div>
  )
}
