import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface StorePageProps {
  params: {
    slug: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = params

  const store = await prisma.store.findUnique({
    where: { slug: slug },
  })

  if (!store) {
    notFound()
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>{store.name}</h1>
      <p>{store.description}</p>
    </main>
  )
}