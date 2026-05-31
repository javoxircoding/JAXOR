import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

// 🔥 ФУНКЦИЯ-НОРМАЛИЗАТОР: Приводит любой ввод телефона к стандарту базы "+998 (XX) XXX-XX-XX"
function normalizeToDbPhone(rawPhone: string): string {
  // Оставляем только цифры
  const digits = rawPhone.replace(/\D/g, '')
  
  // Вытаскиваем чистые 9 цифр самого номера (без кода страны 998)
  const cleanDigits = digits.startsWith('998') ? digits.slice(3) : digits

  // Если длина не совпадает с узбекским номером, возвращаем как есть (пусть Prisma выдаст null)
  if (cleanDigits.length !== 9) return rawPhone

  // Собираем обратно строго по нашей маске онбординга
  const formatted = `+998 (${cleanDigits.slice(0, 2)}) ${cleanDigits.slice(2, 5)}-${cleanDigits.slice(5, 7)}-${cleanDigits.slice(7, 9)}`
  return formatted
}

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Iltimos, barcha maydonlarni to\'ldiring' }, { status: 400 })
    }

    // 🔥 ПРИМЕНЯЕМ КОРРЕКТИРОВКУ: Масштабируем номер под формат в БД
    const dbFormattedPhone = normalizeToDbPhone(phone)

    // Foydalanuvchini topish va uning do'konini ulash (Ищем уже по правильному номеру)
    const user = await prisma.user.findUnique({
      where: { phone: dbFormattedPhone },
      include: { store: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'Telefon yoki parol noto\'g\'ri' }, { status: 401 })
    }

    // FIX: Agar foydalanuvchi do'koni muzlatilgan bo'lsa, tizimga kiritmaymiz
    // Super Admin o'z akkauntiga har doim kira olishi uchun unga cheklov qo'ymaymiz
    if (user.role !== 'SUPER_ADMIN' && user.store && user.store.status === 'BLOCKED') {
      return NextResponse.json(
        { error: "Sizning do'koningiz bloklangan! Iltimos, administrator bilan bog'laning." }, 
        { status: 403 }
      )
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

    // Cookie ga saqlash va frontga ma'lumot qaytarish
    const response = NextResponse.json({
      success: true,
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role
      },
      storeId: user.store?.id
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 kun
      path: '/'
    })

    return response

  } catch (error) {
    console.error('LOGIN ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}