import { Suspense } from 'react'
import Register from '@/components/auth/registr'

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Yuklanmoqda...</div>}>
      <Register />
    </Suspense>
  )
}