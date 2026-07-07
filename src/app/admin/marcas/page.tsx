import type { Metadata } from 'next'
import { getBrands } from '@/lib/services/brand'
import { BrandsManager } from '@/components/admin/brands-manager'

export const metadata: Metadata = { title: 'Marcas' }

export default async function AdminMarcasPage() {
  const brands = await getBrands()

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="font-display text-3xl mb-8">Marcas</h1>
      <BrandsManager brands={brands} />
    </div>
  )
}