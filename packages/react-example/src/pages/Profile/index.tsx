import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNFT3 } from '@nft3sdk/did-manager'
import {
  Message,
  Tabs,
  List,
  Avatar,
  Link,
  Space,
  Button,
  Empty
} from '@arco-design/web-react'
import { IconArrowDown } from '@arco-design/web-react/icon'
import { ReactComponent as IconVerified } from '@assets/verified.svg'

import styles from './style.module.scss'
import useAssets from '@hooks/useAssets'
import useIpfs from '@hooks/useIpfs'
import useProfile from '@hooks/useProfile'
import useSocial from '@hooks/useSocial'
import * as util from '@libs/util'

export default function Profile() {
  const { format } = useIpfs()
  const { client } = useNFT3()
  const { didname } = useParams()
  const identifier = useMemo(() => {
    return client.did.convertName(didname!)
  }, [didname, client.did])
  const [ready, setReady] = useState(false)
  const { socials, list } = useSocial()
  const { tokens, nfts, txs, openseaAssets } = useAssets(identifier)
  const { profile, didinfo, info } = useProfile(identifier)

  const twitterAccount = useMemo(() => {
    const record = socials.find(
      item => item.type === 'twitter' && item.verified === true
    )
    return record
  }, [socials])

  useEffect(() => {
    const handle = Message.loading({
      content: 'Loading...',
      duration: 0
    })
    info().finally(() => {
      setReady(true)
      handle()
    })
  }, [info])

  useEffect(() => {
    list(identifier)
  }, [list, identifier])

  useEffect(() => {
    if (didinfo?.addresses?.length) {
      openseaAssets(didinfo.addresses[0].split(':')[1])
    }
  }, [didinfo, openseaAssets])

  const renderTokens = () => {
    return (
      <List
        dataSource={tokens}
        bordered={false}
        render={(item, i) => (
          <List.Item
            key={i}
            extra={
              <div className={styles.tokenExtra}>
                <span className={styles.tokenTitle}>
                  ${item.balanceUSD.toFixed(2)}
                </span>
                <span className={styles.tokenAmount}>
                  {Number(item.balance.toFixed(3))}
                </span>
              </div>
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar shape="circle">
                  <img src={item.icon} alt="" />
                </Avatar>
              }
              title={<div className={styles.tokenTitle}>{item.symbol}</div>}
              description={
                /^0x(0){40}$/.test(item.contract) === false && (
                  <Link
                    href={`${util.browser(item.network)}/address/${
                      item.contract
                    }`}
                    target="_blank"
                  >
                    {item.contract}
                  </Link>
                )
              }
            />
          </List.Item>
        )}
      />
    )
  }

  const renderTxs = () => {
    return (
      <List
        dataSource={txs}
        bordered={false}
        className={styles.list}
        render={(item, i) => (
          <List.Item
            key={i}
            actions={[
              <Space direction="vertical" className={styles.options}>
                <Button
                  href={`${util.browser(item.network)}/tx/${item.hash}`}
                  target="_blank"
                  type="outline"
                  shape="round"
                >
                  View
                </Button>
                <span>{util.formatDate(Number(item.timestamp) * 1000)}</span>
              </Space>
            ]}
          >
            <List.Item.Meta
              title={<div className={styles.tokenTitle}>{item.symbol}</div>}
              description={
                <div className={styles.txDesc}>
                  <div>
                    <Link
                      href={`${util.browser(item.network)}/address/${
                        item.from
                      }`}
                      target="_blank"
                    >
                      {item.from}
                    </Link>
                  </div>
                  <div className={styles.arrow}>
                    <IconArrowDown />
                  </div>
                  <div>
                    <Link
                      href={`${util.browser(item.network)}/address/${item.to}`}
                      target="_blank"
                    >
                      {item.to}
                    </Link>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    )
  }

  const renderNfts = () => {
    if (!nfts.length) return <Empty />
    return (
      <div className={styles.nfts}>
        {nfts.map(item => (
          <div
            key={item.id}
            className={styles.nftItem}
            style={{ backgroundImage: `url(${item.image_preview_url})` }}
          />
        ))}
      </div>
    )
  }

  if (!ready) return null

  if (!didinfo) {
    return <div className={styles.notfound}>DID not found</div>
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          {!!profile?.avatar && (
            <img src={format(profile?.avatar || '')} alt="" />
          )}
        </div>
        <div className={styles.didname}>{didname}</div>
        {profile?.name && <div className={styles.bio}>{profile.name}</div>}
        {profile?.bio && <div className={styles.bio}>{profile.bio}</div>}
        {twitterAccount && (
          <div className={styles.twitter}>
            <Link
              href={'https://twitter.com/' + twitterAccount.account}
              target="_blank"
            >
              @{twitterAccount.account}
            </Link>
            <IconVerified className={styles.verified} />
          </div>
        )}
      </div>
      <Tabs type="card-gutter" size="large" className={styles.tabs}>
        <Tabs.TabPane key="nft" title="NFT">
          {renderNfts()}
        </Tabs.TabPane>
        <Tabs.TabPane key="portfolio" title="Portfolio">
          {renderTokens()}
        </Tabs.TabPane>
        <Tabs.TabPane key="history" title="History">
          {renderTxs()}
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
