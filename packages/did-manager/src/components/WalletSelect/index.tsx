import { useRef } from 'react'

import NFT3Modal from '../NFT3Modal'
import IconMetamask from './MetaMask'
import IconPhantom from './Phantom'
import IconPetra from './Petra'
import { WalletType } from '../../libs/types'

interface Props {
  visible: boolean
  onClose: (selected?: WalletType) => void
}

interface IWalletItem {
  wallet: WalletType
  icon: any
  link: string
  check: () => boolean
}

export default function WalletSelect({ visible, onClose }: Props) {
  const selected = useRef<number>()

  const wallets: IWalletItem[] = [
    {
      wallet: 'MetaMask',
      icon: IconMetamask,
      link: 'https://metamask.io/download/',
      check: () => {
        return 'ethereum' in window
      }
    },
    {
      wallet: 'Phantom',
      icon: IconPhantom,
      link: 'https://phantom.app/download',
      check: () => {
        return 'phantom' in window
      }
    },
    {
      wallet: 'Petra',
      icon: IconPetra,
      link: 'https://petra.app/',
      check: () => {
        return 'aptos' in window
      }
    }
  ]

  const closeModal = () => {
    if (selected.current !== undefined) {
      const wallet = wallets[selected.current]
      onClose?.(wallet.wallet)
    } else {
      onClose()
    }
    selected.current = undefined
  }

  return (
    <NFT3Modal title="Connect Wallet" visible={visible} onClose={closeModal}>
      <div className="nft3-wallet__list">
        {wallets.map((item, i) => (
          <div
            className="nft3-wallet__item"
            key={i}
            onClick={() => {
              if (item.check()) {
                selected.current = i
                closeModal()
              } else window.open(item.link)
            }}
          >
            <span>{item.check() ? item.wallet : `Install ${item.wallet}`}</span>
            <item.icon className="nft3-wallet__icon" />
          </div>
        ))}
      </div>
    </NFT3Modal>
  )
}
