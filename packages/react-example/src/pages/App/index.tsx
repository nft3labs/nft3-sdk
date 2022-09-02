import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useNFT3 } from '@nft3sdk/did-manager'

import Main from '../Main'
import Home from '@pages/Home'
import Register from '@pages/Register'
import Settings from '@pages/Settings'
import Profile from '@pages/Profile'
import Socials from '@pages/Socials'
import Wallets from '@pages/Wallets'
import AddTwitter from '@pages/AddTwitter'
import Header from '@components/Header'

export default function App() {
  const { eagerConnect } = useNFT3()

  useEffect(() => {
    eagerConnect()
  }, [eagerConnect])

  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />}>
            <Route path="settings" element={<Settings />} />
            <Route path="wallets" element={<Wallets />} />
            <Route path="socials" element={<Socials />} />
            <Route path="add-twitter/:account" element={<AddTwitter />} />
          </Route>
          <Route path="/:didname" element={<Profile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
