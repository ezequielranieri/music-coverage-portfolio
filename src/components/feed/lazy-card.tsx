'use client'

import { useState, useRef, useEffect, type ReactNode } from 'react'

export function LazyCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {show ? children : <div className="rounded-2xl bg-surface-card border border-surface-border min-h-[320px]" />}
    </div>
  )
}
