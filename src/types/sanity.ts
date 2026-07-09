export type PostType = 'image' | 'video' | 'album' | 'text'
export type ContentStatus = 'published' | 'deleted'
export type ContactType = 'prensa' | 'publicidad' | 'consulta'
export type VideoSource = 'tiktok' | 'instagram' | 'native'

export interface SanityImage {
  asset: { _ref?: string; _type?: 'reference'; url?: string }
  alt: string
  hotspot?: { x: number; y: number }
}

export interface VisibleComment {
  _id: string
  authorName: string
  body: string
  createdAt: string
}

export interface Post {
  _id: string
  type: PostType
  title: string
  slug: { current: string }
  body?: string
  image?: SanityImage
  videoSource?: VideoSource
  videoUrl?: string
  videoFile?: { asset: { url: string } }
  album?: Album
  genre?: string[]
  likesCount?: number
  comments?: VisibleComment[]
  showInPortfolio?: boolean
  portfolioOrder?: number
  status: ContentStatus
  publishedAt: string
}

export interface Album {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  coverImage: SanityImage
  photos: SanityImage[]
  isDestacado?: boolean
  showInPortfolio?: boolean
  portfolioOrder?: number
  genre?: string[]
  status?: ContentStatus
}

export interface Brand {
  _id: string
  name: string
  logo: SanityImage
  link: string
  order?: number
}

export interface Profile {
  _id: string
  photo?: SanityImage
  photoFocalX?: number
  photoFocalY?: number
  cover?: SanityImage
  coverFocalX?: number
  coverFocalY?: number
  publicName: string
  role?: string
  bio?: string
  socialLinks?: { tiktok?: string; instagram?: string }
  mediaKitPdf?: { asset: { url: string; originalFilename?: string } }
}
