// hooks/useStoreInfo.ts
import { useEffect, useState } from 'react'

export interface StoreInfo {
  storeName:   string
  storeSlug:   string
  ownerName:   string
  ownerPhone:  string
  plan:        'STARTER' | 'STANDART' | 'PRO'
  status:      'TRIAL' | 'ACTIVE' | 'BLOCKED'
  daysLeft:    number
  description: string
  address:     string
  logo:        string
  banner:      string
}

export function useStoreInfo() {
  const [data,    setData]    = useState<StoreInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = () => {
    setLoading(true)
    fetch('/api/dashboard/store')
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { refetch() }, [])

  return { data, loading, refetch }
}