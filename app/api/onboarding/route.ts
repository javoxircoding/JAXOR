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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const { description, address, logoUrl, bannerUrl } = await req.json()

    // Diqqat: storeId emas, ownerId (userId) orqali update qilamiz
    // Chunki ownerId ham @unique, u hech qachon aldamaydi
    const store = await prisma.store.update({
      where: { 
        ownerId: decoded.userId 
      },
      data: { 
        description, 
        address, 
        logo: logoUrl, 
        banner: bannerUrl 
      }
    })

    return NextResponse.json({ success: true, store })

  } catch (error) {
    console.error('ONBOARDING ERROR:', error)
    // Agar baribir topilmasa, demak Registerda xato bo'lgan yoki do'kon o'chgan
    return NextResponse.json({ 
      error: "Do'kon topilmadi. Qaytadan ro'yxatdan o'ting yoki bazani tekshiring." 
    }, { status: 500 })
  }
}