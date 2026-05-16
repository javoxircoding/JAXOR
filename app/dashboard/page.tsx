import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  let userId = ''
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    userId = decoded.userId
  } catch {
    redirect('/login')
  }

  const store = await prisma.store.findUnique({
    where: { ownerId: userId },
    include: { products: true }
  })

  if (!store) redirect('/onboarding')

  redirect(`/store/${store.slug}`)
}