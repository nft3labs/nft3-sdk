import ReactDOM from 'react-dom/client'
import { NFT3Provider } from '@nft3sdk/did-manager'

import '@arco-design/web-react/dist/css/arco.css'
import App from './pages/App'

const endpoint = 'http://t0.onebitdev.com:10000/'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <NFT3Provider endpoint={endpoint}>
    <App />
  </NFT3Provider>
)
