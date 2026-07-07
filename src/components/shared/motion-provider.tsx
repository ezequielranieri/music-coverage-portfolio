'use client'

import { MotionConfig } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  )
}
