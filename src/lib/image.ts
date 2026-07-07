export function blurUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  return `${url}?w=20&blur=10&q=1`
}
