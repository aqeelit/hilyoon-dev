'use client'

import { ArrowLeft, Calendar, Clock, User, Tag, Twitter, Linkedin, Facebook } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogPost } from '@/lib/blog/data'
import { Locale } from '@/types'
import { LogoMark } from '@/components/brand/Logo'
import { renderMarkdown } from './markdown'

interface BlogPostProps {
  post: BlogPost
  relatedPosts: BlogPost[]
  locale: Locale
}

export function BlogPostView({ post, relatedPosts, locale }: BlogPostProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const labels = {
    en: {
      backToBlog: 'Back to Blog',
      readTime: 'min read',
      shareArticle: 'Share Article',
      relatedPosts: 'Related Posts',
      readMore: 'Read More',
      publishedOn: 'Published on',
      by: 'by'
    },
    ro: {
      backToBlog: 'Înapoi la Blog',
      readTime: 'min citire',
      shareArticle: 'Distribuie Articolul',
      relatedPosts: 'Articole Similare',
      readMore: 'Citește Mai Mult',
      publishedOn: 'Publicat pe',
      by: 'de'
    },
    ar: {
      backToBlog: 'العودة إلى المدونة',
      readTime: 'دقيقة قراءة',
      shareArticle: 'شارك المقال',
      relatedPosts: 'مقالات ذات صلة',
      readMore: 'اقرأ المزيد',
      publishedOn: 'نُشر في',
      by: 'بواسطة'
    }
  }

  const content = labels[locale] || labels.en

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `${post.title} - ${post.excerpt}`

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI Trends': 'bg-aqua-400/10 text-aqua-300',
      'Machine Learning': 'bg-emerald-400/10 text-emerald-300',
      'Automation': 'bg-violet-400/10 text-violet-300',
      'Industry News': 'bg-gold-400/10 text-gold-300',
      'Case Studies': 'bg-rose-400/10 text-rose-300'
    }
    return colors[category] || 'bg-white/[0.05] text-slate-200'
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Back to Blog */}
      <div className="mb-8">
        <Link 
          href={`/${locale}/blog`}
          className="inline-flex items-center text-aqua-300 hover:text-aqua-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {content.backToBlog}
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            <Tag className="h-4 w-4 mr-1" />
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-slate-400 leading-relaxed mb-8">
          {post.excerpt}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center space-x-6">
            {/* Author */}
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-aqua-500/40 to-ink-800 rounded-full flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">{post.author.name}</p>
                <p className="text-sm text-slate-500">{post.author.role}</p>
              </div>
            </div>

            {/* Date and Reading Time */}
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{content.publishedOn} {formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} {content.readTime}</span>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 mr-2">{content.shareArticle}:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-96 bg-gradient-to-br from-aqua-500/40 to-ink-800 rounded-2xl overflow-hidden mb-8">
        <div className="bg-grid absolute inset-0 opacity-70" />
        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <LogoMark className="h-28 w-auto opacity-90" />
          </div>
        )}
      </div>

      {/* Article Content: Markdown from the API; renderMarkdown escapes all HTML first */}
      <div className="mb-12 max-w-none text-[1.05rem]">
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-12 pb-8 border-b border-white/[0.08]">
          <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-white/[0.05] text-slate-300 text-sm rounded-md hover:bg-white/10 transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      <div className="mb-12 p-6 bg-ink-900 rounded-2xl">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-aqua-500/40 to-ink-800 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-semibold text-white mb-2">{content.by} {post.author.name}</h4>
            <p className="text-slate-400 mb-3">{post.author.bio}</p>
            <div className="flex space-x-3">
              {post.author.social.twitter && (
                <a className="inline-flex items-center h-9 px-3 rounded-md border border-white/10 text-sm font-medium hover:bg-white/[0.05]" href={`https://twitter.com/${post.author.social.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-1" />
                    Twitter
                  </a>
              )}
              {post.author.social.linkedin && (
                <a className="inline-flex items-center h-9 px-3 rounded-md border border-white/10 text-sm font-medium hover:bg-white/[0.05]" href={`https://linkedin.com${post.author.social.linkedin}`} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-white mb-8">{content.relatedPosts}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-aqua-500/40 to-ink-800 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/60 text-3xl font-bold">#{relatedPost.id}</div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/${locale}/blog/${relatedPost.slug}`} className="hover:text-aqua-200 transition-colors">
                      {relatedPost.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>{formatDate(relatedPost.publishedAt)}</span>
                    <span>{relatedPost.readTime} {content.readTime}</span>
                  </div>
                  <Link 
                    href={`/${locale}/blog/${relatedPost.slug}`}
                    className="text-aqua-300 hover:text-aqua-200 text-sm font-medium"
                  >
                    {content.readMore} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
