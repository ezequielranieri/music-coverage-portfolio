import { Skeleton } from '@/components/ui/skeleton'

export default function PostSlugLoading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
