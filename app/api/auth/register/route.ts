import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, storeName, storeType, plan } = await req.json()

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: "Bu telefon allaqachon ro'yxatdan o'tgan" }, { status: 400 })
    }

    // PLAN VALIDATION
    const allowedPlans = ['starter', 'standart', 'pro']
    if (!allowedPlans.includes(plan)) {
      return NextResponse.json({ error: 'Noto‘g‘ri tarif' }, { status: 400 })
    }

    const dbPlan = plan.toUpperCase()

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        store: {
          create: {
            name: storeName,
            slug: storeName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
            type: storeType,
            plan: dbPlan,
            status: 'TRIAL',
          }
        }
      },
      include: { store: true }
    })

    const token = jwt.sign(
      { userId: user.id, storeId: user.store?.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      userId: user.id,
      storeId: user.store?.id
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    return response

  } catch (error) {
    console.error('REGISTER ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}