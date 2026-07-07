import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? 'Cobertura de evento'
  const imageUrl = searchParams.get('image')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backgroundColor: '#0F0F12',
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: '48px 48px 36px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 6,
              background: 'linear-gradient(135deg, #FF3D77 0%, #7C3AED 100%)',
              marginRight: 24,
              borderRadius: 4,
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 48, color: 'white', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
              {title}
            </p>
            <p style={{ fontSize: 24, color: '#A3A3AB', margin: 0 }}>
              {SITE_NAME}
            </p>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
