import { useCallback, useEffect, useState } from 'react'
import { ProfileModel } from '@nft3sdk/client'
import { useNFT3 } from '@nft3sdk/did-manager'

export default function useProfile() {
  const [profile, setProfile] = useState<ProfileModel>()
  const { identifier, client } = useNFT3()

  const get = useCallback(async () => {
    if (!identifier) {
      setProfile(undefined)
      return
    }
    const profile = await client?.profile.get()
    setProfile(profile)
    return profile
  }, [identifier, client])

  useEffect(() => {
    get()
  }, [get])

  return {
    profile
  }
}