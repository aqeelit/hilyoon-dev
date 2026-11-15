// Typed access to the PHP blog API, mapped to the BlogPost shape the UI uses.
import type { BlogCategory, BlogPost } from '@/lib/blog/data'
import type { Locale } from '@/types'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/hilyoon-backend/api'

// ---- Raw API shapes -------------------------------------------------------

export interface ApiBlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content?: string
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  featured_image: string | null
  language: Locale
  status: 'published' | 'draft'
  is_featured: boolean
  read_time: number
  views_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  tags?: { name: string; slug: string }[]
  author?: { name: string; email?: string; avatar?: string | null } | null
  category?: { name: string; slug: string; color?: string; description?: string } | null
  related_posts?: ApiBlogPost[]
}

export interface ApiCategory {
  id: number
  name: string
  slug: string
  description: string | null
  color: string
  language: Locale
  post_count: number
}

export interface PostsResponse {
  posts: ApiBlogPost[]
  pagination?: { total: number; limit: number; offset: number; pages: number; current_page: number }
  total?: number
}

interface Envelope<T> {
  success: boolean
  status_code: number
  message: string
  data: T
}

// ---- Fetch helper (works in server and client components) -----------------

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function apiGet<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') qs.append(key, String(value))
  }
  const url = `${API_BASE_URL}${path}${qs.size ? `?${qs}` : ''}`

  const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
  let body: Envelope<T>
  try {
    body = await res.json()
  } catch {
    throw new ApiError(`Invalid response from API (${res.status})`, res.status)
  }
  if (!body.success) throw new ApiError(body.message || 'API request failed', body.status_code ?? res.status)
  return body.data
}

// ---- Mapping --------------------------------------------------------------

export function mapApiPost(post: ApiBlogPost): BlogPost {
  const authorName = post.author?.name || 'Hilyoon Team'
  return {
    id: String(post.id),
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    content: post.content ?? '',
    author: {
      id: post.author?.email || authorName,
      name: authorName,
      bio: '',
      avatar: post.author?.avatar || '',
      role: 'Author',
      social: {},
    },
    category: post.category?.name ?? '',
    tags: (post.tags ?? []).map((t) => t.name),
    publishedAt: post.published_at || post.created_at,
    updatedAt: post.updated_at,
    readTime: post.read_time || 1,
    featured: Boolean(post.is_featured),
    image: post.featured_image || '',
    seo: {
      metaTitle: post.meta_title || `${post.title} | Hilyoon`,
      metaDescription: post.meta_description || post.excerpt || '',
      keywords: (post.meta_keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      ogImage: post.featured_image || undefined,
    },
    locale: post.language,
  }
}

export function mapApiCategory(c: ApiCategory): BlogCategory {
  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? '',
    color: c.color,
    locale: c.language,
  }
}

// ---- Public functions -----------------------------------------------------

export async function fetchPosts(params: {
  locale: Locale
  limit?: number
  offset?: number
  category?: string
  search?: string
  featured?: boolean
}): Promise<{ posts: BlogPost[]; total: number }> {
  const data = await apiGet<PostsResponse>('/blog/posts', params)
  return {
    posts: data.posts.map(mapApiPost),
    total: data.pagination?.total ?? data.total ?? data.posts.length,
  }
}

/** Returns null when the post does not exist. */
export async function fetchPost(slug: string, locale: Locale): Promise<{ post: BlogPost; related: BlogPost[] } | null> {
  try {
    const data = await apiGet<ApiBlogPost>(`/blog/post/${encodeURIComponent(slug)}`, { locale })
    return {
      post: mapApiPost(data),
      related: (data.related_posts ?? []).map((p) => mapApiPost({ ...p, language: locale })),
    }
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  }
}

export async function fetchCategories(locale: Locale): Promise<BlogCategory[]> {
  const data = await apiGet<{ categories: ApiCategory[] }>('/blog/categories', { locale })
  return data.categories.map(mapApiCategory)
}
