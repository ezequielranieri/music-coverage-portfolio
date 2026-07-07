import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/services/auth'
import { validateImageFile, uploadImageAsset } from '@/lib/services/upload'

export async function POST(request: NextRequest) {
  await requireAdmin()

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
  }

  const validationError = validateImageFile(file)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const assetId = await uploadImageAsset(file)

  return NextResponse.json({ assetId })
}
