import { Suspense } from 'react'
import { PublicNav } from '@/components/feed/public-nav'
import { FeedFilters } from '@/components/feed/feed-filters'
import { ProfileSection } from '@/components/feed/profile-section'
import { StoriesSection } from '@/components/feed/stories-section'
import { BrandsSection } from '@/components/feed/brands-section'
import { FeedSection } from '@/components/feed/feed-section'
import { auth } from '@clerk/nextjs/server'
import dynamic from 'next/dynamic'
import { PoweredBy } from '@/components/shared/powered-by'

const ContactForm = dynamic(() => import('@/components/feed/contact-form').then(m => m.ContactForm), {
  loading: () => <div className="h-64 rounded-2xl bg-surface-card border border-surface-border animate-pulse" />,
})

function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-surface-border" />
      <div className="h-6 w-48 rounded bg-surface-border" />
      <div className="h-4 w-32 rounded bg-surface-border" />
      <div className="flex gap-3 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-surface-border" />
        ))}
      </div>
    </div>
  )
}

function StoriesSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-16 h-16 rounded-full bg-surface-border shrink-0" />
      ))}
    </div>
  )
}

function BrandsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-surface-border" />
      ))}
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-96 rounded-2xl bg-surface-border" />
      ))}
    </div>
  )
}

interface HomeProps {
  searchParams: Promise<{ type?: string; genre?: string; sort?: string; q?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const { userId } = await auth()
  const isAdmin = !!userId

  return (
    <>
      <PublicNav />
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileSection />
      </Suspense>
      <main className="max-w-[1240px] mx-auto px-4 pt-4 pb-6 space-y-6">
        <Suspense fallback={<StoriesSkeleton />}>
          <StoriesSection />
        </Suspense>
        <FeedFilters currentType={params.type} currentGenre={params.genre} currentSort={params.sort} currentQuery={params.q} />
        <Suspense fallback={<BrandsSkeleton />}>
          <BrandsSection />
        </Suspense>
        <Suspense fallback={<FeedSkeleton />}>
          <FeedSection filters={{ ...params }} isAdmin={isAdmin} />
        </Suspense>
        <div className="max-w-xl mx-auto w-full">
          <ContactForm />
        </div>
      </main>
      <PoweredBy />
    </>
  )
}

export const revalidate = 60