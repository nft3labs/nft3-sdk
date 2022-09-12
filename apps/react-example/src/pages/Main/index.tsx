import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './style.module.scss'

export default function Main() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>NFT3 DID</div>
      <input
        type="text"
        placeholder="Search by DID, e.g. alice.isme"
        className={styles.input}
        value={keyword}
        onChange={e => {
          setKeyword(e.target.value.trim())
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') navigate('/' + keyword)
        }}
      />
    </div>
  )
}
