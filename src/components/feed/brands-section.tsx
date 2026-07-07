import { getBrands } from '@/lib/services/brand'
import { BrandsGrid } from './brands-grid'

export async function BrandsSection() {
  const brands = await getBrands()
  return (
    <section aria-labelledby="brands-heading">
      <h2 id="brands-heading" className="sr-only">Marcas</h2>
      <BrandsGrid brands={brands} />
    </section>
  )
}
