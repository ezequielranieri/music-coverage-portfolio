import { NextResponse } from 'next/server'
import { writeClient } from '@/lib/sanity/write-client'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString()

  const expiredPosts: { _id: string }[] = await writeClient.fetch(
    `*[_type == "post" && status == "deleted" && deletedAt < $cutoff]{ _id }`,
    { cutoff }
  )
  const expiredAlbums: { _id: string }[] = await writeClient.fetch(
    `*[_type == "album" && status == "deleted" && deletedAt < $cutoff]{ _id }`,
    { cutoff }
  )

  const idsToDelete = [...expiredPosts, ...expiredAlbums].map((doc) => doc._id)

  if (idsToDelete.length > 0) {
    const transaction = writeClient.transaction()
    idsToDelete.forEach((id) => transaction.delete(id))
    await transaction.commit()
  }

  return NextResponse.json({ purged: idsToDelete.length })
}
