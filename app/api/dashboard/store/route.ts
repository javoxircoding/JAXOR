// app/api/dashboard/store/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

// ─── Хелпер: достаём userId из куки ─────────────────────
function getUserId(req: NextRequest): string | null {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) return null
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

// ─── GET: получить данные магазина ───────────────────────
export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      select: {
        name:        true,
        slug:        true,
        plan:        true,
        status:      true,
        trialEndsAt: true,
        description: true,
        address:     true,
        logo:        true,
        banner:      true,
        owner: {
          select: { name: true, phone: true }
        }
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    let daysLeft = 0
    if (store.status === 'TRIAL' && store.trialEndsAt) {
      const diffMs = new Date(store.trialEndsAt).getTime() - Date.now()
      daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    }

    return NextResponse.json({
      storeName:   store.name,
      storeSlug:   store.slug,
      ownerName:   store.owner?.name ?? 'User',
      ownerPhone:  store.owner?.phone ?? '',
      plan:        store.plan,
      status:      store.status,
      daysLeft,
      description: store.description ?? '',
      address:     store.address     ?? '',
      logo:        store.logo        ?? '',
      banner:      store.banner      ?? '',
    })

  } catch (error) {
    console.error('DASHBOARD STORE GET ERROR:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// ─── PATCH: сохранить изменения магазина ─────────────────
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    const body = await req.json() as {
      name?:        string
      description?: string
      address?:     string
      logo?:        string
      banner?:      string
    }

    // Проверка: имя не может быть пустым если передали
    if (body.name !== undefined && !body.name.trim()) {
      return NextResponse.json({ error: "Do'kon nomi bo'sh bo'lishi mumkin emas" }, { status: 400 })
    }

    const store = await prisma.store.findUnique({
      where: { ownerId: userId },
      select: { id: true }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const updated = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...(body.name        !== undefined && { name:        body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.address     !== undefined && { address:     body.address     }),
        ...(body.logo        !== undefined && { logo:        body.logo        }),
        ...(body.banner      !== undefined && { banner:      body.banner      }),
      },
      select: { name: true, slug: true, description: true, address: true, logo: true, banner: true }
    })

    return NextResponse.json({ success: true, store: updated })

  } catch (error) {
    console.error('DASHBOARD STORE PATCH ERROR:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}