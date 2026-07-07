import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Panel' }

export default function AdminPage() {
  redirect('/admin/crear')
}