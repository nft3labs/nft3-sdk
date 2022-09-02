import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Menu, Modal } from '@arco-design/web-react'
import { useNFT3 } from '@nft3sdk/did-manager'

import styles from './style.module.scss'
import WalletSelect from '@components/WalletSelect'

export default function Header() {
  const navigate = useNavigate()
  const [selectVisible, setSelectVisible] = useState(false)
  const { account, didname, needRegister, ready, login, selectWallet, logout } =
    useNFT3()

  const onLogout = () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to logout?',
      onOk: () => {
        logout()
        navigate('/')
      }
    })
  }

  useEffect(() => {
    if (needRegister) navigate('/register')
  }, [needRegister, navigate])

  const renderBtn = () => {
    if (!account) {
      return (
        <Button
          size="large"
          shape="round"
          type="primary"
          onClick={() => setSelectVisible(true)}
        >
          Connect Wallet
        </Button>
      )
    }
    if (!didname) {
      return (
        <Button
          type="primary"
          shape="round"
          size="large"
          onClick={login}
          loading={!ready}
        >
          Login NFT3
        </Button>
      )
    }
    return (
      <Dropdown
        droplist={
          <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/' + didname)}>
              Your profile
            </Menu.Item>
            <Menu.Item key="settings" onClick={() => navigate('/home/settings')}>
              Settings
            </Menu.Item>
            <Menu.Item key="wallets" onClick={() => navigate('/home/wallets')}>
              Wallets
            </Menu.Item>
            <Menu.Item key="social" onClick={() => navigate('/home/socials')}>
              Social accounts
            </Menu.Item>
            <Menu.Item key="logout" onClick={onLogout}>
              Logout
            </Menu.Item>
          </Menu>
        }
        position="bottom"
      >
        <Button type="primary" shape="round" size="large">
          {didname}
        </Button>
      </Dropdown>
    )
  }

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          NFT3 SDK
        </Link>
        {renderBtn()}
      </header>
      <WalletSelect
        visible={selectVisible}
        onClose={wallet => {
          if (wallet) selectWallet(wallet)
          setSelectVisible(false)
        }}
      />
    </>
  )
}
