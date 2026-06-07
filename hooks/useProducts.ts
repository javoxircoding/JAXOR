// hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react'

export interface RealProduct {
  id:          string
  name:        string
  description: string
  price:       number
  stock:       number
  image:       string | null
  storeId:     string
  createdAt:   string
}

export function useProducts() {
  const [products, setProducts] = useState<RealProduct[]>([])
  const [loading,  setLoading]  = useState(true)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    fetch('/api/dashboard/products')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, loading, refetch: fetchProducts }
}