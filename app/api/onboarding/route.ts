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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, storeId: string }

    const { description, address, logoUrl, bannerUrl } = await req.json()

    const store = await prisma.store.update({
      where: { id: decoded.storeId },
      data: { description, address, logo: logoUrl, banner: bannerUrl }
    })

    return NextResponse.json({ success: true, store })

  } catch (error) {
    console.error('ONBOARDING ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}