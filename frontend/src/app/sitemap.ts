import type { MetadataRoute } from 'next'
import { fetchPosts } from '@/lib/api/blog'
import { locales } from '@/types'
import { projects } from '@/content/projects'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hilyoon.com'

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/${locale}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/${locale}/projects`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((p) => ({ url: `${baseUrl}/${locale}/projects/${p.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 })),
  ])

  // Published posts from the API; if the API is down, still serve the static pages
  const blogPages: MetadataRoute.Sitemap = []
  for (const locale of locales) {
    try {
      const { posts } = await fetchPosts({ locale, limit: 50 })
      for (const post of posts) {
        blogPages.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    } catch (err) {
      console.error(`Sitemap: failed to load ${locale} posts`, err)
    }
  }

  return [...staticPages, ...blogPages]
}
