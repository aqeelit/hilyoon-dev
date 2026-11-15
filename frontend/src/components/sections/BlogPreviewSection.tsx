'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/home/SectionHeader'
import type { BlogPost } from '@/lib/blog/data'
import { fetchPosts } from '@/lib/api/blog'
import type { Locale } from '@/types'

interface BlogPreviewSectionProps {
  locale: Locale
}

const labels: Record<Locale, { eyebrow: string; title: string; viewAll: string; min: string }> = {
  en: { eyebrow: 'Our blog', title: 'Insights on AI engineering', viewAll: 'View all articles', min: 'min read' },
  ro: { eyebrow: 'Blogul nostru', title: 'Perspective despre ingineria AI', viewAll: 'Vezi toate articolele', min: 'min de citit' },
  ar: { eyebrow: 'مدونتنا', title: 'رؤى حول هندسة الذكاء الاصطناعي', viewAll: 'عرض كل المقالات', min: 'دقائق قراءة' },
}

const thumbs = [
  'from-aqua-500/40 via-ink-800 to-ink-900',
  'from-gold-500/30 via-ink-800 to-ink-900',
  'from-sky-500/30 via-ink-800 to-ink-900',
]

export function BlogPreviewSection({ locale }: BlogPreviewSectionProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const t = labels[locale] ?? labels.en

  // Latest 3 published posts from the API
  useEffect(() => {
    let cancelled = false
    fetchPosts({ locale, limit: 3 })
      .then(({ posts }) => { if (!cancelled) setPosts(posts) })
      .catch((err) => console.error('Blog preview error:', err))
    return () => { cancelled = true }
  }, [locale])

  // Nothing to show until posts are published
  if (posts.length === 0) return null

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <section className="bg-ink-950 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader align="start" eyebrow={t.eyebrow} title={t.title} />
          <Link
            href={`/${locale}/blog`}
            className="btn-ghost shrink-0 !px-5 !py-2.5"
          >
            {t.viewAll}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="surface surface-hover group overflow-hidden"
            >
              <div className={`relative aspect-[16/10] bg-gradient-to-br ${thumbs[i % thumbs.length]}`}>
                <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                {post.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  {post.category && (
                    <span className="tag-brand">{post.category}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} {t.min}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-white transition group-hover:text-aqua-300">{post.title}</h3>
                <p className="mt-3 text-sm text-slate-500">{formatDate(post.publishedAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
