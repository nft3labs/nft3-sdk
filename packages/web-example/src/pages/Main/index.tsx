import styles from './style.module.scss'
import useAssets from '../../hooks/useAssets'
import useProfile from "../../hooks/useProfile"
import * as util from '../../libs/util'

export default function Main() {
  const { tokens } = useAssets()
  const { profile } = useProfile()

  return (
    <main className={styles.wrap}>
      <h1>Profile</h1>
      {!!profile && (
        <div>
          <img src={util.formatUrl(profile.avatar)} alt="" />
          <div>Name: {profile.name}</div>
          <div>Bio: {profile.bio}</div>
        </div>
      )}
      <h1>Tokens</h1>
      <div>
        {tokens.map((item, i) => (
          <div key={i}>{item.symbol} {item.balance}</div>
        ))}
      </div>
    </main>
  )
}
