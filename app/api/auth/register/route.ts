import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Принимаем Имя, Пароль и выбранный тариф (План)
    const { name, password, plan } = body 

    // Валидация
    if (!name?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Ism va parolni kiriting" },
        { status: 400 }
      )
    }

    // Проверяем, нет ли юзера с таким же Именем/Фамилией
    const existingUser = await prisma.user.findFirst({
      where: { name: name.trim() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu foydalanuvchi nomi allaqachon mavjud" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Создаем чистого пользователя. Поле phone запишется как null автоматически!
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        password: hashedPassword,
        // Сразу сохраняем выбранный план, приводя к верхнему регистру (STARTER, STANDART, PRO)
        plan: (plan?.toUpperCase() as any) || 'STARTER',
      },
    })

    // Генерируем токен (пока без storeId, так как магазина еще нет)
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      message: "Ro'yxatdan muvaffaqiyatli o'tdingiz. Endi obunani rasmiylashtiring.",
      user: { id: user.id, name: user.name, role: user.role }
    })

    // Устанавливаем HTTP-only куку для авторизации
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
    return NextResponse.json({ error: 'Server xatosi', details: String(error) }, { status: 500 })
  }
}