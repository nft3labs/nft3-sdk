import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useNFT3 } from '@nft3sdk/did-manager'

import Header from '../../components/Header'
import Main from '../Main'
import Register from '../Register'

export default function App() {
  const { eagerConnect } = useNFT3()

  useEffect(() => {
    eagerConnect()
  }, [eagerConnect])

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
