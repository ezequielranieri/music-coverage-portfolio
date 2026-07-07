'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function TikTokEmbed({ url }: { url: string }) {
  const [html, setHtml] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/oembed/tiktok?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((data) => setHtml(data.html))
      .catch(() => setError(true))
  }, [url])

  useEffect(() => {
    if (html && typeof window !== 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      document.body.appendChild(script)
      return () => {
        document.body.removeChild(script)
      }
    }
  }, [html])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-text-muted text-sm p-4 text-center">
        No se pudo cargar el video.{' '}
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent-pink underline ml-1">
          Verlo en TikTok
        </a>
      </div>
    )
  }

  if (!html) return <Skeleton className="w-full h-full" />

  return <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: html }} />
}