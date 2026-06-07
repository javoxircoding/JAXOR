// app/api/store/order/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const runtime = 'nodejs'

// ── Zod схема ────────────────────────────────────────────
const OrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity:  z.number().int().positive(),
  price:     z.number().positive(),
})

const OrderSchema = z.object({
  storeId: z.string().min(1),
  phone:   z.string().min(9).max(20),
  address: z.string().min(3).max(200),
  items:   z.array(OrderItemSchema).min(1),
  total:   z.number().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Валидация
    const parsed = OrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { storeId, phone, address, items, total } = parsed.data

    // Проверяем что магазин существует и активен
    const store = await prisma.store.findUnique({
      where:  { id: storeId },
      select: { id: true, status: true }
    })

    if (!store) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 })
    }
    if (store.status === 'BLOCKED') {
      return NextResponse.json({ error: "Do'kon vaqtincha ishlamayapti" }, { status: 403 })
    }

    // Проверяем что товары реально существуют и в наличии
    const productIds = items.map(i => i.productId)
    const products   = await prisma.product.findMany({
      where:  { id: { in: productIds }, storeId },
      select: { id: true, stock: true, price: true }
    })

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Mahsulotlardan biri topilmadi' }, { status: 400 })
    }

    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ error: 'Mahsulot omborda yetarli emas' }, { status: 400 })
      }
    }

    // Создаём заказ + уменьшаем stock в транзакции
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          storeId,
          total,
          status: 'NEW',
          // Сохраняем контакты в поле (если добавишь поля в схему)
          // phone, address — добавить в Order модель если нужно
        }
      })

      // Уменьшаем stock каждого товара
      await Promise.all(
        items.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } }
          })
        )
      )

      return newOrder
    })

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 })

  } catch (error) {
    console.error('ORDER ERROR:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}