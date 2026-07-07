import { getDestacadosAlbums } from '@/lib/services/album'
import { StoryCircles } from './story-circles'

export async function StoriesSection() {
  const destacados = await getDestacadosAlbums()
  return (
    <section aria-labelledby="stories-heading">
      <h2 id="stories-heading" className="sr-only">Álbumes destacados</h2>
      <StoryCircles albums={destacados} />
    </section>
  )
}
