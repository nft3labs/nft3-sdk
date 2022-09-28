import ReactDOM from 'react-dom/client'
import { ConfigProvider } from '@arco-design/web-react'
import enUS from '@arco-design/web-react/es/locale/en-US'
import { NFT3Provider } from '@nft3sdk/did-manager'
import '@arco-design/web-react/dist/css/arco.css'

import './assets/global.scss'
import App from './pages/App'

const endpoint = 'https://t0.onebitdev.com/nft3-gateway/'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider locale={enUS}>
    <NFT3Provider endpoint={endpoint} silent>
      <App />
    </NFT3Provider>
  </ConfigProvider>
)
