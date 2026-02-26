import { Suspense } from 'react'
import Onboarding from '@/components/auth/onboarding/onboarding'

export default function OnboardPage() {
    return (
        <Suspense fallback={<div>Yuklanmoqda...</div>}>
            <Onboarding />
        </Suspense>
    )
}