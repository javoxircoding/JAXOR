// app/api/dashboard/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

function getUserId(req: NextRequest): string | null {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch { return null }
}

// ─── GET: все продукты магазина ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const store = await prisma.store.findUnique({
      where:  { ownerId: userId },
      select: { id: true }
    })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    const products = await prisma.product.findMany({
      where:   { storeId: store.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ products })
  } catch (e) {
    console.error('PRODUCTS GET:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// ─── POST: создать продукт ───────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const store = await prisma.store.findUnique({
      where:  { ownerId: userId },
      select: { id: true }
    })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    const body = await req.json()
    const { name, description, price, stock, image } = body

    if (!name?.trim()) return NextResponse.json({ error: 'Nom kiritilishi shart' }, { status: 400 })
    if (!price || Number(price) <= 0) return NextResponse.json({ error: 'Narx kiritilishi shart' }, { status: 400 })

    const product = await prisma.product.create({
      data: {
        storeId:     store.id,
        name:        name.trim(),
        description: description ?? '',
        price:       Number(price),
        stock:       Number(stock) || 0,
        image:       image || null,
      }
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (e) {
    console.error('PRODUCTS POST:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// ─── PATCH: обновить продукт ─────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, name, description, price, stock, image } = body

    if (!id) return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 })

    // Проверяем что продукт принадлежит этому пользователю
    const store = await prisma.store.findUnique({
      where:  { ownerId: userId },
      select: { id: true }
    })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    const product = await prisma.product.update({
      where: { id, storeId: store.id },
      data: {
        ...(name        !== undefined && { name:        name.trim() }),
        ...(description !== undefined && { description              }),
        ...(price       !== undefined && { price:       Number(price) }),
        ...(stock       !== undefined && { stock:       Number(stock) }),
        ...(image       !== undefined && { image                     }),
      }
    })

    return NextResponse.json({ product })
  } catch (e) {
    console.error('PRODUCTS PATCH:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// ─── DELETE: удалить продукт ─────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID kiritilishi shart' }, { status: 400 })

    const store = await prisma.store.findUnique({
      where:  { ownerId: userId },
      select: { id: true }
    })
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 })

    await prisma.product.delete({ where: { id, storeId: store.id } })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('PRODUCTS DELETE:', e)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}