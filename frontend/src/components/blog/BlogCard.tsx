'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react'
import Link from 'next/link'
import { LogoMark } from '@/components/brand/Logo'
import { BlogPost } from '@/lib/blog/data'
import { Locale } from '@/types'

interface BlogCardProps {
  post: BlogPost
  locale: Locale
  featured?: boolean
}

export function BlogCard({ post, locale, featured = false }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI Trends': 'bg-aqua-400/10 text-aqua-300',
      'Machine Learning': 'bg-emerald-400/10 text-emerald-300',
      'Automation': 'bg-violet-400/10 text-violet-300',
      'Industry News': 'bg-gold-400/10 text-gold-300',
      'Case Studies': 'bg-rose-400/10 text-rose-300',
      'Tendințe AI': 'bg-aqua-400/10 text-aqua-300',
      'Învățare Automată': 'bg-emerald-400/10 text-emerald-300',
      'Automatizare': 'bg-violet-400/10 text-violet-300',
      'اتجاهات الذكاء الاصطناعي': 'bg-aqua-400/10 text-aqua-300',
      'التعلم الآلي': 'bg-emerald-400/10 text-emerald-300'
    }
    return colors[category] || 'bg-white/[0.05] text-slate-200'
  }

  const cardClasses = featured 
    ? 'group border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-3 md:col-span-2'
    : 'group border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-2'

  const imageHeight = featured ? 'h-64' : 'h-48'

  return (
    <Card className={cardClasses}>
      {/* Image */}
      <div className={`relative ${imageHeight} bg-gradient-to-br from-aqua-500/40 to-ink-800 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
            <Tag className="h-3 w-3 mr-1" />
            {post.category}
          </span>
        </div>
        {post.featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-400/15 text-gold-300">
              ⭐ Featured
            </span>
          </div>
        )}
        {/* Placeholder for blog image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <LogoMark className="h-20 w-auto opacity-90" />
        </div>
      </div>

      <CardHeader className={featured ? 'pb-4 px-6' : 'pb-4'}>
        <h3 className={`font-bold text-white group-hover:text-aqua-300 transition-colors leading-tight ${featured ? 'text-2xl' : 'text-xl'}`}>
          <Link href={`/${locale}/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
      </CardHeader>

      <CardContent className={featured ? 'px-6' : ''}>
        <p className={`text-slate-400 leading-relaxed mb-6 ${featured ? 'text-lg' : ''}`}>
          {post.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-aqua-500/40 to-ink-800 rounded-full flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">{post.author.name}</p>
            <p className="text-xs text-slate-500">{post.author.role}</p>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(post.publishedAt)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readTime} min read
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-white/[0.05] text-slate-400 text-xs rounded-md">
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/[0.05] text-slate-400 text-xs rounded-md">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read More Link */}
        <Link 
          href={`/${locale}/blog/${post.slug}`}
          className="inline-flex items-center text-aqua-300 hover:text-aqua-200 font-medium group-hover:translate-x-1 transition-transform"
        >
          {locale === 'en' ? 'Read More' :
           locale === 'ro' ? 'Citește Mai Mult' :
           'اقرأ المزيد'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
