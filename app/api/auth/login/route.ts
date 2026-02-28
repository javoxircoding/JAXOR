import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    // Foydalanuvchini topish
    const user = await prisma.user.findUnique({
      where: { phone },
      include: { store: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Telefon yoki parol noto\'g\'ri' }, { status: 401 })
    }

    // Parolni tekshirish
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Telefon yoki parol noto\'g\'ri' }, { status: 401 })
    }

    // Token yaratish
    const token = jwt.sign(
      { userId: user.id, storeId: user.store?.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Cookie ga saqlash
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
      storeId: user.store?.id
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 kun
    })

    return response

  } catch (error) {
    console.error('LOGIN ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}