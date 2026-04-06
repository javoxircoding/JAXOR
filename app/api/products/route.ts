import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    const userStore = await prisma.store.findUnique({
      where: { ownerId: decoded.userId },
      select: { id: true }
    })

    if (!userStore) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 })
    }

    const { products } = await req.json()

    const validProducts = products
      .map((p: any) => {
        const price = Number(p.narx)

        if (!p.nom || p.nom.trim() === '') return null
        if (isNaN(price) || price <= 0) return null

        return {
          name: p.nom.trim(),
          price,
          description: p.tavsif?.trim() || '',
          image: p.image && p.image.startsWith('http') ? p.image : null,
          storeId: userStore.id,
        }
      })
      .filter(Boolean)

    if (validProducts.length === 0) {
      return NextResponse.json({ error: 'Kamida 1 ta tovar kiriting' }, { status: 400 })
    }

    await prisma.product.createMany({
      data: validProducts
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PRODUCTS ERROR:', error)
    return NextResponse.json({ error: 'Tovarlarni saqlashda xatolik yuz berdi' }, { status: 500 })
  }
}