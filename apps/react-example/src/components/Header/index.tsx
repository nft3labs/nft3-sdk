import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Dropdown, Menu, Modal, Message } from '@arco-design/web-react'
import { useNFT3, WalletType } from '@nft3sdk/did-manager'

import styles from './style.module.scss'
import WalletSelect from '@components/WalletSelect'

export default function Header() {
  const navigate = useNavigate()
  const [selectVisible, setSelectVisible] = useState(false)
  const {
    client,
    account,
    didname,
    ready,
    login,
    disconnect,
    selectWallet,
    logout
  } = useNFT3()

  const onLogin = async () => {
    const info = await login()
    if (info.result === false && info.needRegister === true) {
      navigate('/register')
    }
  }

  const onConnect = async (wallet: WalletType) => {
    try {
      console.log('start')
      const address = await selectWallet(wallet)
      console.log(address)
      await onLogin()
    } catch (error: any) {
      Message.error(error.message)
      console.trace(error)
    } finally {
      console.log('end')
    }
  }

  const onLogout = () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to logout?',
      onOk: () => {
        logout()
        navigate('/')
        console.log(client)
      }
    })
  }

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
          onClick={onLogin}
          loading={!ready}
        >
          Login NFT3
        </Button>
      )
    }
    return (
      <Dropdown
        trigger="click"
        droplist={
          <Menu>
            <Menu.Item key="profile" onClick={() => navigate('/' + didname)}>
              Your profile
            </Menu.Item>
            <Menu.Item
              key="settings"
              onClick={() => navigate('/home/settings')}
            >
              Settings
            </Menu.Item>
            <Menu.Item key="wallets" onClick={() => navigate('/home/wallets')}>
              Wallets
            </Menu.Item>
            <Menu.Item key="social" onClick={() => navigate('/home/socials')}>
              Social accounts
            </Menu.Item>
            <Menu.Item key="disconnect" onClick={disconnect}>
              Disconnect
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
          if (wallet) onConnect(wallet)
          setSelectVisible(false)
        }}
      />
    </>
  )
}
