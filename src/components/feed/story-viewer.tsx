'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { storySlide } from '@/lib/motion'
import type { Album } from '@/types/sanity'

const PHOTO_DURATION_MS = 5000

interface StoryViewerProps {
  albums: Album[]
  initialIndex: number
  onClose: () => void
}

export function StoryViewer({ albums, initialIndex, onClose }: StoryViewerProps) {
  const [albumIndex, setAlbumIndex] = useState(initialIndex)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [direction, setDirection] = useState(1)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  const currentAlbum = albums[albumIndex]
  const currentPhoto = currentAlbum.photos[photoIndex]

  const goToNextPhoto = useCallback(() => {
    if (photoIndex < currentAlbum.photos.length - 1) {
      setDirection(1)
      setPhotoIndex((p) => p + 1)
      setProgress(0)
    } else if (albumIndex < albums.length - 1) {
      setDirection(1)
      setAlbumIndex((a) => a + 1)
      setPhotoIndex(0)
      setProgress(0)
    } else {
      onClose()
    }
  }, [photoIndex, currentAlbum, albumIndex, albums.length, onClose])

  const goToPrevPhoto = useCallback(() => {
    if (photoIndex > 0) {
      setDirection(-1)
      setPhotoIndex((p) => p - 1)
      setProgress(0)
    } else if (albumIndex > 0) {
      setDirection(-1)
      const prevAlbum = albums[albumIndex - 1]
      setAlbumIndex((a) => a - 1)
      setPhotoIndex(prevAlbum.photos.length - 1)
      setProgress(0)
    }
  }, [photoIndex, albumIndex, albums])

  useEffect(() => {
    startRef.current = performance.now()

    function tick(now: number) {
      const elapsed = now - startRef.current
      const pct = Math.min(elapsed / PHOTO_DURATION_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        goToNextPhoto()
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [albumIndex, photoIndex, goToNextPhoto])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goToNextPhoto()
      if (e.key === 'ArrowLeft') goToPrevPhoto()
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') e.preventDefault()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goToNextPhoto, goToPrevPhoto, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        {currentAlbum.photos.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white"
              style={{
                width: i < photoIndex ? '100%' : i === photoIndex ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute top-8 right-4 z-10 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-full p-1"
        aria-label="Cerrar historia"
      >
        <X size={24} />
      </button>

      <div className="absolute inset-0 flex z-0">
        <div className="w-1/3 h-full" onClick={goToPrevPhoto} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full" onClick={goToNextPhoto} />
      </div>

      <button onClick={goToPrevPhoto}
        disabled={albumIndex === 0 && photoIndex === 0}
        className="hidden md:block absolute left-4 z-10 text-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-full p-2"
        aria-label="Foto anterior"
      >
        <ChevronLeft size={32} />
      </button>
      <button onClick={goToNextPhoto}
        className="hidden md:block absolute right-4 z-10 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-full p-2"
        aria-label="Foto siguiente"
      >
        <ChevronRight size={32} />
      </button>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={`${albumIndex}-${photoIndex}`}
          src={currentPhoto.asset.url ?? ''}
          alt={currentPhoto.alt || 'Foto del álbum'}
          custom={direction}
          variants={storySlide}
          initial="enter"
          animate="center"
          exit="exit"
          className="max-h-full max-w-full object-contain"
        />
      </AnimatePresence>
    </motion.div>
  )
}
