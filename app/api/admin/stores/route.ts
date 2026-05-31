import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 })
    }

    // Проверяем токен под твою роль SUPER_ADMIN
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string }
    
    if (decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Ruxsat berilmagan (Siz Super Admin emassiz!)' }, { status: 403 })
    }

    // 1. Вытаскиваем магазины вместе с владельцем (User)
    const rawStores = await prisma.store.findMany({
      include: {
        owner: {
          select: {
            name: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 2. МОДИФИЦИРУЕМ ДАННЫЕ НА СЕРВЕРЕ: считаем точные дни для каждого магазина
    const now = new Date()

    const stores = rawStores.map((store) => {
      const end = new Date(store.trialEndsAt)
      
      // Высчитываем чистую разницу в днях, учитывая таймзоны
      const differenceInTime = end.getTime() - now.getTime()
      const daysLeft = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24))

      return {
        ...store,
        // Добавляем готовое число дней прямо в объект магазина!
        daysLeft: daysLeft > 0 ? daysLeft : 0 
      }
    })

    // Отдаем чистые данные на фронтенд
    return NextResponse.json({ success: true, stores })

  } catch (error) {
    console.error('SUPERADMIN GET STORES ERROR:', error)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}