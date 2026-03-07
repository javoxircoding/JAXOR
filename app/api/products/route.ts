import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // 1. Token tekshirish
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    // Tokenni tekshirish va ma'lumotlarni olish
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // 2. Do'konni bazadan aniq topish (Xavfsizlik uchun)
    const userStore = await prisma.store.findUnique({
      where: { ownerId: decoded.userId },
      select: { id: true }
    })

    if (!userStore) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 })
    }

    const { products } = await req.json()

    // 3. Bo'sh bo'lmagan mahsulotlarni filtrlash
    const validProducts = products.filter((p: any) => 
      p.nom && p.nom.trim() !== '' && p.narx !== ''
    )

    if (validProducts.length === 0) {
      return NextResponse.json({ error: 'Kamida 1 ta tovar kiriting' }, { status: 400 })
    }

    // 4. Mahsulotlarni rasm linki bilan birga bazaga saqlash
    await prisma.product.createMany({
      data: validProducts.map((p: any) => ({
        name: p.nom,
        price: parseFloat(p.narx),
        description: p.tavsif || '',
        image: p.image || null, // Frontenddan kelgan Cloudinary/Upload linki
        storeId: userStore.id,  // Do'kon ID-si bilan bog'lash
      }))
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('PRODUCTS ERROR:', error)
    return NextResponse.json({ error: 'Tovarlarni saqlashda xatolik yuz berdi' }, { status: 500 })
  }
}