import axios, { AxiosInstance } from 'axios'

export default class NFT3Gateway {
  private id = 1
  private request: AxiosInstance

  constructor(endpoint: string) {
    this.request = axios.create({
      baseURL: endpoint.replace(/\/$/, '')
    })
  }

  async send<T = any>(method: string, params: Record<string, any> = {}) {
    const body = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.id++
    }
    const { data } = await this.request.post('/', body)
    if (data.error) throw data.error
    return data.result as T
  }
}
