import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { name, phone, password, storeName, storeType } = await req.json()

    const existing = await prisma.user.findUnique({ where: { phone } })
    if (existing) {
      return NextResponse.json({ error: "Bu telefon allaqachon ro'yxatdan o'tgan" }, { status: 400 })
    }

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
            plan: 'STARTER',
            status: 'TRIAL',
          }
        }
      },
      include: { store: true }
    })

    return NextResponse.json({ success: true, userId: user.id, storeId: user.store?.id })

  } catch (error) {
    console.error('REGISTER ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}