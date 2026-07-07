import type { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
}

export const likeBounce: Variants = {
  idle: { scale: 1 },
  tapped: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.35, times: [0, 0.4, 1], ease: 'easeOut' },
  },
}

export const storySlide: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 35 } },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
}

export const REDUCED_MOTION_FALLBACK: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
}
