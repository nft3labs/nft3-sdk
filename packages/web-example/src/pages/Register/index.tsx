import { Button } from '@arco-design/web-react'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function Register() {
  const { register } = useNFT3()

  return (
    <div>
      <Button size="large" type="primary">Register</Button>
    </div>
  )
}
