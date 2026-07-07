import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { ClerkProviderClient } from '@/components/shared/clerk-provider-client'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/admin/sign-in')
  }

  return (
    <ClerkProviderClient>
      <div className="min-h-screen bg-surface flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto pt-16 lg:pt-0">
          {children}
        </main>
        <Toaster position="top-right" theme="dark" toastOptions={{ style: { background: '#17171B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', color: '#F2F2F3' } }} />
      </div>
    </ClerkProviderClient>
  )
}
