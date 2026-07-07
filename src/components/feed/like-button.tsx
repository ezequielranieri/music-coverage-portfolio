'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { likePostAction } from '@/app/actions/like'

interface LikeButtonProps {
  postId: string
  initialLikes: number
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()
  const [hasLiked, setHasLiked] = useState(false)

  function handleLike() {
    if (hasLiked || isPending) return
    setHasLiked(true)
    setLikes((prev) => prev + 1)
    startTransition(async () => {
      try {
        await likePostAction(postId)
      } catch {
        setHasLiked(false)
        setLikes((prev) => prev - 1)
      }
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={hasLiked || isPending}
      className="flex items-center gap-1.5 text-text-secondary disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink rounded-full p-1"
      aria-label="Me gusta"
    >
      <span className={`inline-block transition-transform duration-300 ${hasLiked ? 'scale-125' : 'scale-100'}`}>
        <Heart size={20} fill={hasLiked ? '#FF3D77' : 'none'} className={hasLiked ? 'text-accent-pink' : ''} />
      </span>
      <span className="text-sm font-mono">{likes}</span>
    </button>
  )
}