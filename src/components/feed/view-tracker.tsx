'use client'

import { useEffect, useRef } from 'react'
import { registerViewAction } from '@/app/actions/view'

export function ViewTracker({ postId }: { postId: string }) {
  const hasTracked = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          hasTracked.current = true
          registerViewAction(postId)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [postId])

  return <div ref={ref} className="absolute inset-0 pointer-events-none" />
}