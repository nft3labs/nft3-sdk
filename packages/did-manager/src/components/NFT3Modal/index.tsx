import { PropsWithChildren } from 'react'
import { useNFT3 } from '../../hooks/webNFT3'

interface Props {
  title: string
  visible: boolean
  onClose: () => void
}

export default function NFT3Modal({
  title,
  visible,
  onClose,
  children
}: PropsWithChildren<Props>) {
  const { theme } = useNFT3()

  const className = () => {
    let name = 'nft3-modal'
    if (theme === 'dark') name += ' nft3-modal__dark'
    if (visible === true) name += ' nft3-modal__visible'
    return name
  }

  return (
    <div className={className()}>
      <div className="nft3-modal__mask" onClick={onClose} />
      <div className="nft3-modal__body">
        <div className="nft3-modal__header">
          <div className="nft3-modal__title">{title}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="nft3-modal__close"
            onClick={onClose}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <div className="nft3-modal__content">{children}</div>
      </div>
    </div>
  )
}
