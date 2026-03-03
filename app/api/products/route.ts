import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Token tekshirish
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, storeId: string }

    const { products } = await req.json()

    // Bo'sh tovarlarni filtrlash
    const validProducts = products.filter((p: { nom: string, narx: string, tavsif: string }) =>
      p.nom.trim() !== '' && p.narx !== ''
    )

    if (validProducts.length === 0) {
      return NextResponse.json({ error: 'Kamida 1 ta tovar kiriting' }, { status: 400 })
    }

    // Tovarlarni saqlash
    await prisma.product.createMany({
      data: validProducts.map((p: { nom: string, narx: string, tavsif: string }) => ({
        name: p.nom,
        price: parseFloat(p.narx),
        description: p.tavsif,
        storeId: decoded.storeId,
      }))
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PRODUCTS ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}