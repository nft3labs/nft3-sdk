import { PropsWithChildren } from 'react'

interface Props {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export default function NFT3Button(props: PropsWithChildren<Props>) {
  return (
    <button
      className="nft3-button"
      disabled={props.disabled || props.loading}
      onClick={props.onClick}
    >
      {props.loading && (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          width="18"
          height="18"
          viewBox="0 0 48 48"
          focusable="false"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          className="nft3-loading"
        >
          <path d="M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6"></path>
        </svg>
      )}
      {props.children}
    </button>
  )
}
