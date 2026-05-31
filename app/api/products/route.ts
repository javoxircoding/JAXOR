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

    // Вытаскиваем userId из JWT токена вендора
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }

    // Ищем магазин, принадлежащий этому вендору
    const userStore = await prisma.store.findUnique({
      where: { ownerId: decoded.userId },
      select: { id: true }
    })

    if (!userStore) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 })
    }

    // Достаем именно { products } из тела запроса
    const body = await req.json()
    const products = body.products

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Tovar ma’lumotlari topilmadi' }, { status: 400 })
    }

    // Массив, куда будем пушить только строго валидные объекты для Prisma
    const productsToSave: any[] = []

    // Перебираем и жестко валидируем каждый товар, отсекая null на лету
    for (const p of products) {
      if (!p || !p.nom || p.nom.trim() === '') continue

      const price = Number(p.narx)
      if (isNaN(price) || price <= 0) continue

      const stock = p.stock !== undefined ? Number(p.stock) : 0

      // Пушим чистый объект БЕЗ полей createdAt и updatedAt (Prisma сама их заполнит)
      productsToSave.push({
        name: p.nom.trim(),
        price,
        stock: isNaN(stock) ? 0 : stock,
        description: p.tavsif?.trim() || null,
        image: p.image ? p.image : null,
        storeId: userStore.id // Жесткая привязка к магазину
      })
    }

    if (productsToSave.length === 0) {
      return NextResponse.json({ error: 'Kamida 1 ta tovar ma’lumotlarini to‘g‘ri kiriting' }, { status: 400 })
    }

    // Массово сохраняем в Supabase — теперь массив абсолютно чист и типизирован
    await prisma.product.createMany({
      data: productsToSave
    })

    return NextResponse.json({ success: true, count: productsToSave.length })

  } catch (error: any) {
    console.error('PRODUCTS API ERROR:', error)
    return NextResponse.json(
      { error: 'Tovarlarni saqlashda xatolik yuz berdi', details: error.message }, 
      { status: 500 }
    )
  }
}