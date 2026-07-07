export function AlbumBreadcrumbJsonLd({ title, slug }: { title: string; slug: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Portfolio', item: `${baseUrl}/portfolio` },
      { '@type': 'ListItem', position: 2, name: title, item: `${baseUrl}/portfolio/${slug}` },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
    />
  )
}
