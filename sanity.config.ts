import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset, projectId } from './src/sanity/env'
import { post } from './sanity/schemas/documents/post'
import { album } from './sanity/schemas/documents/album'
import { brand } from './sanity/schemas/documents/brand'
import { message } from './sanity/schemas/documents/message'
import { comment } from './sanity/schemas/documents/comment'
import { profile } from './sanity/schemas/documents/profile'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: {
    types: [post, album, brand, message, comment, profile],
  },
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})
