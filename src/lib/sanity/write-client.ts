import 'server-only'
import { createClient } from 'next-sanity'

// Cliente de ESCRITURA — solo se importa desde Server Actions / Route Handlers
// El paquete 'server-only' hace que el build falle si esto se importa desde un Client Component
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
})
