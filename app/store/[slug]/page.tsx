import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const store = await prisma.store.findUnique({
    where: { slug },
    include: { products: true }
  })

  if (!store) return notFound()

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      
      {store.banner && (
        <img src={store.banner} alt="banner" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        {store.logo && (
          <img src={store.logo} alt="logo" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%' }} />
        )}
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>{store.name}</h1>
          <p style={{ margin: '4px 0', color: '#666' }}>{store.description}</p>
          <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>📍 {store.address}</p>
        </div>
      </div>

      <h2>Tovarlar ({store.products.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {store.products.map((product) => (
          <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '16px' }}>
            {product.image && (
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />
            )}  
            <h3 style={{ margin: '0 0 4px' }}>{product.name}</h3>
            <p style={{ margin: '0 0 4px', color: '#666', fontSize: '14px' }}>{product.description}</p>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#2563eb' }}>{product.price.toLocaleString()}so'm</p>
          </div>
        ))}
      </div>
    </div>
  )
}