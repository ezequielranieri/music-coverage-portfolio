import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-6 px-4">
      <img src="/logo.svg" alt={process.env.NEXT_PUBLIC_SITE_NAME ?? ''} className="h-10 w-auto" />
      <div className="w-full max-w-sm">
        <SignIn />
      </div>
    </div>
  )
}
