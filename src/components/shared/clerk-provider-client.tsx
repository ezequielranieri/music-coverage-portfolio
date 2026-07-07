'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import type { ReactNode } from 'react'

export function ClerkProviderClient({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#17171B',
          colorPrimary: '#FF3D77',
          colorForeground: '#F2F2F3',
          colorMutedForeground: '#A3A3AB',
          colorInput: '#1E1E23',
          colorInputForeground: '#F2F2F3',
          colorNeutral: 'white',
          colorDanger: '#EF4444',
          colorSuccess: '#22C55E',
          borderRadius: '0.75rem',
        },
      } as any}
      localization={{
        signIn: {
          start: {
            title: 'Acceso administrador',
            subtitle: 'Iniciá sesión para administrar tu portfolio',
          },
        },
      } as any}
    >
      {children}
    </ClerkProvider>
  )
}
