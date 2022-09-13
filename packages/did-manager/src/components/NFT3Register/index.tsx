import { useState } from 'react'

import NFT3Modal from '../NFT3Modal'
import NFT3Button from '../NFT3Button'
import { useNFT3 } from '../../hooks/webNFT3'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function NFT3Register({ visible, onClose }: Props) {
  const { register } = useNFT3()
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    try {
      setLoading(true)
      await register(value)
    } catch (error) {
      console.trace(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <NFT3Modal visible={visible} onClose={onClose} title="DID Register">
      <div className="nft3-register">
        <div className="nft3-register__form">
          <input
            type="text"
            className="nft3-register__input"
            placeholder="Your DID name"
            value={value}
            onChange={e => {
              setValue(e.target.value.trim())
            }}
          />
          <div className="nft3-register__after">.isme</div>
        </div>
        <NFT3Button disabled={!value} loading={loading} onClick={submit}>
          Register
        </NFT3Button>
      </div>
    </NFT3Modal>
  )
}
