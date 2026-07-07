import { Skeleton } from '@/components/ui/skeleton'

export default function PortfolioSlugLoading() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 py-8">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="max-w-xl mx-auto space-y-4">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}
