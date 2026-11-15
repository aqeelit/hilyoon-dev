import { cache } from 'react'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { BlogPostView } from '@/components/blog/BlogPostView'
import { fetchPost } from '@/lib/api/blog'
import { locales, type Locale } from '@/types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Posts come from the API at request time
export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    locale: string
    slug: string
  }>
}

// Dedupe within one request so metadata + page make a single API call (and one view count)
const getPost = cache((slug: string, locale: Locale) => fetchPost(slug, locale))

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const result = isLocale(locale) ? await getPost(decodeURIComponent(slug), locale).catch(() => null) : null

  if (!result) {
    return {
      title: 'Post Not Found | Hilyoon',
      description: 'The requested blog post could not be found.'
    }
  }

  const { post } = result
  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: post.locale,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.seo.ogImage ? [
        {
          url: post.seo.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.seo.ogImage ? [post.seo.ogImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const result = await getPost(decodeURIComponent(slug), locale)
  if (!result) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Navigation locale={locale} />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogPostView
            post={result.post}
            relatedPosts={result.related}
            locale={locale}
          />
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
