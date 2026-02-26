import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  try {
    // Token tekshirish
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, storeId: string }

    const { description, address } = await req.json()

    // Do'konni yangilash
    const store = await prisma.store.update({
      where: { id: decoded.storeId },
      data: { description, address }
    })

    return NextResponse.json({ success: true, store })

  } catch (error) {
    console.error('ONBOARDING ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}