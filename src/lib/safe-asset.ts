export function safeUrl(url: string | null | undefined, fallback = ''): string {
  return url ?? fallback
}

export function safeAssetUrl(asset: { url?: string | null } | null | undefined, fallback = ''): string {
  return asset?.url ?? fallback
}
