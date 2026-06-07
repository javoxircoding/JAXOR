import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
export const runtime = 'nodejs'

import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })
    }

    // TYPE CHECK
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Noto‘g‘ri fayl turi' }, { status: 400 })
    }

    // SIZE CHECK
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fayl juda katta (max 2MB)' }, { status: 400 })
    }

    const filename = `public/${randomUUID()}-${file.name}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { error } = await supabase.storage
      .from('images')
      .upload(filename, buffer, {
        contentType: file.type
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filename)

    return NextResponse.json({ url: data.publicUrl })

  } catch (error) {
    console.error('UPLOAD ERROR:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}