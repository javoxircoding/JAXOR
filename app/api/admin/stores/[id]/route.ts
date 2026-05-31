import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'

// Проверка на SUPER_ADMIN
async function checkAdmin(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) throw new Error('Avtorizatsiya talab qilinadi')
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string }
  if (decoded.role !== 'SUPER_ADMIN') throw new Error('Ruxsat berilmagan')
}

// ========================================================
// 1. DO'KON СТАТУСИ И ТАРИФИНИ О'ZGARTIRISH (PATCH)
// ========================================================
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await checkAdmin(req)
    
    const { id } = await params
    // Принимаем status и plan с фронтенда
    const { status, plan } = await req.json() 

    // Сюда запишем новую дату, если тариф меняется
    let newTrialEndsAt: Date | undefined = undefined

    // АВТОМАТИЧЕСКИЙ РАСЧЕТ ДНЕЙ ДЛЯ ТАРИФОВ JAXOR ENGINE
    if (plan) {
      newTrialEndsAt = new Date() // Берем текущее время (сегодня)

      // 🔥 ЖЕЛЕЗОБЕТОННО: Переводим пришедшую строку в КАПС, 
      // чтобы исключить баги, если с фронта прилетит "standart" или "Standart"
      const UPPER_PLAN = plan.toUpperCase()

      if (UPPER_PLAN === 'STANDART' || UPPER_PLAN === 'PRO') {
        newTrialEndsAt.setDate(newTrialEndsAt.getDate() + 30) // Если платный тариф — даем 30 дней от сегодня
      } else if (UPPER_PLAN === 'STARTER') {
        newTrialEndsAt.setDate(newTrialEndsAt.getDate() + 14) // Если откатили на Starter — даем 14 дней от сегодня
      }
    }

    // Обновляем магазин в Supabase
    const updatedStore = await prisma.store.update({
      where: { id: id },
      data: { 
        status: status || undefined, 
        plan: plan ? plan.toUpperCase() : undefined, // Всегда сохраняем в базу капсом (STARTER, STANDART, PRO)
        
        // Если мы пересчитали дату (был передан plan), Prisma запишет её. 
        // Если plan не передавали (меняли только статус), поле даты вообще не тронется.
        ...(newTrialEndsAt && { trialEndsAt: newTrialEndsAt })
      }
    })

    return NextResponse.json({ success: true, store: updatedStore })
  } catch (error: any) {
    console.error("PATCH STORE ERROR:", error)
    return NextResponse.json({ error: error.message || 'Server xatosi' }, { status: 400 })
  }
}

// ========================================================
// 2. DO'KON VA UNING EGASINI BUTUNLAY O'CHIRISH (DELETE)
// ========================================================
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await checkAdmin(req)
    
    const { id } = await params

    // Находим магазин, чтобы узнать ID его владельца (User)
    const store = await prisma.store.findUnique({
      where: { id: id },
      select: { ownerId: true }
    })

    if (!store) {
      return NextResponse.json({ error: "Do'kon topilmadi" }, { status: 404 })
    }

    // Удаляем сам магазин (каскадом удалятся продукты, заказы и платежи, так как настроен Cascade в схеме)
    await prisma.store.delete({
      where: { id: id }
    })

    // Удаляем пользователя-владельца, чтобы не засорять базу "сиротами"
    if (store.ownerId) {
      await prisma.user.delete({
        where: { id: store.ownerId }
      })
    }

    return NextResponse.json({ 
      success: true, 
      message: "Do'kon, mahsulotlar va foydalanuvchi Genoсide-режимом удалены!" 
    })

  } catch (error: any) {
    console.error("DELETE STORE ERROR:", error)
    return NextResponse.json({ error: error.message || 'Server xatosi' }, { status: 400 })
  }
}