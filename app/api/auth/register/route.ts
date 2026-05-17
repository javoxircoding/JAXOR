
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      phone,
      password,
      storeName,
      storeType,
      plan,
    } = await req.json()

    // =========================
    // VALIDATION
    // =========================

    if (
      !name ||
      !phone ||
      !password ||
      !storeName ||
      !storeType ||
      !plan
    ) {
      return NextResponse.json(
        { error: "Barcha maydonlarni to‘ldiring" },
        { status: 400 }
      )
    }

    // =========================
    // EXISTING USER CHECK
    // =========================

    const existingUser = await prisma.user.findUnique({
      where: {
        phone,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Bu telefon allaqachon ro‘yxatdan o‘tgan",
        },
        { status: 400 }
      )
    }

    // =========================
    // PLAN VALIDATION
    // =========================

    const allowedPlans = ['starter', 'standart', 'pro']

    if (!allowedPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Noto‘g‘ri tarif tanlandi' },
        { status: 400 }
      )
    }

    // =========================
    // GENERATED VALUES
    // =========================

    const generatedSlug =
      storeName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') +
      '-' +
      Date.now()

    const hashedPassword = await bcrypt.hash(password, 10)

    const dbPlan = plan.toUpperCase()

    // =========================
    // CREATE USER + STORE
    // =========================

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,

        store: {
          create: {
            name: storeName,

            slug: generatedSlug,

            subdomain: generatedSlug,

            type: storeType,

            plan: dbPlan,

            status: 'TRIAL',
          },
        },
      },

      include: {
        store: true,
      },
    })

    // =========================
    // JWT TOKEN
    // =========================

    const token = jwt.sign(
      {
        userId: user.id,
        storeId: user.store?.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d',
      }
    )

    // =========================
    // RESPONSE
    // =========================

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },

      store: user.store,
    })

    // =========================
    // COOKIE
    // =========================

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('REGISTER ERROR:', error)

    return NextResponse.json(
      {
        error: 'Server xatosi',
        details: String(error),
      },
      { status: 500 }
    )
  }
}