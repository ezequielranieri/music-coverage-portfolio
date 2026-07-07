export function PostBreadcrumbJsonLd({ title, slug }: { title: string; slug: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Feed', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: title, item: `${baseUrl}/post/${slug}` },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
    />
  )
}
