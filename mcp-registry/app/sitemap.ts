import { MetadataRoute } from 'next'
import { getAllServers } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mcpregistry.dev'

  const { servers } = await getAllServers()

  const serverUrls = servers.map(server => ({
    url: `${appUrl}/servers/${server.id}`,
    lastModified: new Date(server.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${appUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...serverUrls,
  ]
}
