import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const filename = searchParams.get('filename') ?? 'Media_Kit.pdf'

  if (!url) {
    return new NextResponse('Missing url param', { status: 400 })
  }

  const res = await fetch(url)
  if (!res.ok) {
    return new NextResponse('Failed to fetch file', { status: 502 })
  }

  const blob = await res.blob()

  return new NextResponse(blob, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
