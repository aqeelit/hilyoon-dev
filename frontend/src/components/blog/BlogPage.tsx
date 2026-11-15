'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { BlogCard } from '@/components/blog/BlogCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { Pagination } from '@/components/blog/Pagination'
import { fetchPosts } from '@/lib/api/blog'
import type { BlogPost } from '@/lib/blog/data'
import { Locale } from '@/types'

interface BlogPageProps {
  locale: Locale
}

const POSTS_PER_PAGE = 6

export default function BlogPage({ locale }: BlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPosts, setTotalPosts] = useState(0)

  // Load posts and featured posts
  useEffect(() => {
    loadPosts()
    loadFeaturedPosts()
  }, [locale, selectedCategory, searchQuery, currentPage])

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { posts, total } = await fetchPosts({
        locale,
        limit: POSTS_PER_PAGE,
        offset: (currentPage - 1) * POSTS_PER_PAGE,
        category: selectedCategory || undefined,
        search: searchQuery || undefined
      })

      setPosts(posts)
      setTotalPosts(total)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message || 'Failed to load posts')
      console.error('Blog posts error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadFeaturedPosts = async () => {
    try {
      const { posts } = await fetchPosts({ locale, limit: 6, featured: true })
      setFeaturedPosts(posts)
    } catch (err) {
      console.error('Featured posts error:', err)
      // Don't show error for featured posts as they're optional
    }
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

  // Reset pagination when filters change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const content = {
    en: {
      title: 'Latest Insights & Updates',
      subtitle: 'Discover the latest in AI, machine learning, and business automation',
      featuredTitle: 'Featured Articles',
      allPostsTitle: 'All Articles',
      noResults: 'No articles found matching your criteria.',
      tryDifferent: 'Try adjusting your search or filters.',
      loading: 'Loading articles...',
      error: 'Error loading articles'
    },
    ro: {
      title: 'Ultimele Perspective și Actualizări',
      subtitle: 'Descoperă ultimele noutăți în AI, învățare automată și automatizarea afacerilor',
      featuredTitle: 'Articole Recomandate',
      allPostsTitle: 'Toate Articolele',
      noResults: 'Nu au fost găsite articole care să corespundă criteriilor tale.',
      tryDifferent: 'Încearcă să ajustezi căutarea sau filtrele.',
      loading: 'Se încarcă articolele...',
      error: 'Eroare la încărcarea articolelor'
    },
    ar: {
      title: 'أحدث الرؤى والتحديثات',
      subtitle: 'اكتشف أحدث ما في الذكاء الاصطناعي والتعلم الآلي وأتمتة الأعمال',
      featuredTitle: 'مقالات مميزة',
      allPostsTitle: 'جميع المقالات',
      noResults: 'لم يتم العثور على مقالات تطابق معاييرك.',
      tryDifferent: 'حاول تعديل البحث أو المرشحات.',
      loading: 'جاري تحميل المقالات...',
      error: 'خطأ في تحميل المقالات'
    }
  }

  const pageContent = content[locale] || content.en

  return (
    <div className="min-h-screen">
      <Navigation locale={locale} />
      
      <main className="pt-20">
        {/* Header */}
        <section className="bg-gradient-to-br from-ink-900 to-ink-950 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
              {pageContent.title}
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {pageContent.subtitle}
            </p>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && !searchQuery && !selectedCategory && (
          <section className="py-16 bg-ink-850">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-white mb-8">{pageContent.featuredTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} locale={locale} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Section */}
        <section className="py-16 bg-ink-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">{pageContent.allPostsTitle}</h2>
            
            {/* Filters */}
            <BlogFilters
              locale={locale}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onCategoryChange={handleCategoryChange}
              onSearchChange={handleSearchChange}
            />

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-16">
                <div className="animate-spin h-8 w-8 border-4 border-aqua-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-400">{pageContent.loading}</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-rose-400/10 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-3xl">❌</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{pageContent.error}</h3>
                <p className="text-slate-400 mb-4">{error}</p>
                <button 
                  onClick={loadPosts}
                  className="px-4 py-2 bg-aqua-400 text-ink-950 rounded hover:bg-aqua-300"
                >
                  🔄 Try Again
                </button>
              </div>
            )}

            {/* Posts Grid */}
            {!isLoading && !error && posts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} locale={locale} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  locale={locale}
                />
              </>
            )}

            {/* No Results */}
            {!isLoading && !error && posts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-slate-500 text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{pageContent.noResults}</h3>
                <p className="text-slate-400">{pageContent.tryDifferent}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
