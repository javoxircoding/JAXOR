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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string }

    const { name, type, phone, description, address, logo, banner } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { plan: true }
    })

    if (!name?.trim() || !type || !phone?.trim()) {
      return NextResponse.json({ error: "Do'kon nomi, turi va telefon raqami kiritilishi shart!" }, { status: 400 })
    }

    const UPPER_PLAN = (user?.plan || 'STARTER') as 'STARTER' | 'STANDART' | 'PRO'
    const DAYS_MAP = { STARTER: 14, STANDART: 30, PRO: 30 }

    const trialEndDate = new Date()
    trialEndDate.setDate(trialEndDate.getDate() + (DAYS_MAP[UPPER_PLAN] || 14))

    const generatedSlug = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { phone: phone.trim() }
    })

    const existingStore = await prisma.store.findUnique({
      where: { ownerId: decoded.userId }
    })

    let store

    if (existingStore) {
      store = await prisma.store.update({
        where: { ownerId: decoded.userId },
        data: {
          name: name.trim(),
          type,
          slug: generatedSlug,
          description,
          address,
          logo,
          banner,
          plan: UPPER_PLAN,
          trialEndsAt: trialEndDate
        }
      })
    } else {
      const baseSubdomain = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
      const generatedSubdomain = `${baseSubdomain}-${Math.floor(1000 + Math.random() * 9000)}`

      store = await prisma.store.create({
        data: {
          ownerId: decoded.userId,
          name: name.trim(),
          type,
          slug: generatedSlug,
          subdomain: generatedSubdomain,
          plan: UPPER_PLAN,
          status: 'TRIAL',
          trialEndsAt: trialEndDate,
          description,
          address,
          logo,
          banner
        }
      })
    }

    const updatedToken = jwt.sign(
      { userId: decoded.userId, storeId: store.id, role: decoded.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({ success: true, store })
    response.cookies.set('token', updatedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('ONBOARDING ERROR:', error)
    return NextResponse.json({ error: "Serverda xatolik yuz berdi." }, { status: 500 })
  }
}