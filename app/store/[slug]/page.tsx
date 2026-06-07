// app/store/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import StoreFront from './StoreFront'

interface Props {
  params: Promise<{ slug: string }>   // ← в Turbopack params это Promise
}

async function getStore(slug: string) {
  return prisma.store.findUnique({
    where: { slug },
    select: {
      id:          true,
      name:        true,
      description: true,
      logo:        true,
      banner:      true,
      slug:        true,
      status:      true,
      products: {
        where:   { stock: { gt: 0 } },
        select: {
          id:          true,
          name:        true,
          description: true,
          price:       true,
          image:       true,
          stock:       true,
        },
        orderBy: { createdAt: 'desc' },
      }
    }
  })
}

export default async function StorePage({ params }: Props) {
  const { slug } = await params    // ← await здесь

  const store = await getStore(slug)

  if (!store) notFound()

  if (store.status === 'BLOCKED') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0f172a', color: '#f1f5f9', textAlign: 'center', padding: 24,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
          Do'kon vaqtincha to'xtatilgan
        </h1>
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Iltimos, keyinroq urinib ko'ring
        </p>
      </div>
    )
  }

  return <StoreFront store={store} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params    // ← и тут тоже
  const store = await getStore(slug)
  if (!store) return { title: "Do'kon topilmadi" }
  return {
    title:       store.name,
    description: store.description ?? `${store.name} — online do'kon`,
    openGraph: {
      title:  store.name,
      images: store.banner ? [store.banner] : [],
    }
  }
}