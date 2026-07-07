import { ClerkProviderClient } from '@/components/shared/clerk-provider-client'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProviderClient>{children}</ClerkProviderClient>
}
