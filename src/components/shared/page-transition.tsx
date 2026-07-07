'use client'

import { useState, useEffect, useRef } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setKey((k) => k + 1)
  }, [children])

  return (
    <div ref={ref} key={key} className="animate-page-enter">
      {children}
    </div>
  )
}
