'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BlogCategory } from '@/lib/blog/data'
import { fetchCategories } from '@/lib/api/blog'
import { Locale } from '@/types'

interface BlogFiltersProps {
  locale: Locale
  selectedCategory: string | null
  searchQuery: string
  onCategoryChange: (category: string | null) => void
  onSearchChange: (query: string) => void
}

export function BlogFilters({ 
  locale, 
  selectedCategory, 
  searchQuery, 
  onCategoryChange, 
  onSearchChange 
}: BlogFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  
  const [categories, setCategories] = useState<BlogCategory[]>([])

  useEffect(() => {
    let cancelled = false
    fetchCategories(locale)
      .then((list) => { if (!cancelled) setCategories(list) })
      .catch((err) => console.error('Categories error:', err))
    return () => { cancelled = true }
  }, [locale])

  const selectedName = categories.find((c) => c.slug === selectedCategory)?.name ?? selectedCategory
  
  const labels = {
    en: {
      search: 'Search articles...',
      filters: 'Filters',
      allCategories: 'All Categories',
      clearFilters: 'Clear Filters'
    },
    ro: {
      search: 'Caută articole...',
      filters: 'Filtre',
      allCategories: 'Toate Categoriile',
      clearFilters: 'Șterge Filtrele'
    },
    ar: {
      search: 'البحث في المقالات...',
      filters: 'المرشحات',
      allCategories: 'جميع الفئات',
      clearFilters: 'مسح المرشحات'
    }
  }

  const content = labels[locale] || labels.en

  const clearAllFilters = () => {
    onCategoryChange(null)
    onSearchChange('')
  }

  const hasActiveFilters = selectedCategory || searchQuery

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-5 w-5" />
        <input
          type="text"
          placeholder={content.search}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-ink-950/70 py-3 ps-10 pe-4 text-white placeholder:text-slate-600 transition focus:border-aqua-400/60 focus:outline-none focus:ring-2 focus:ring-aqua-400/20"
        />
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          {content.filters}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-slate-500 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            {content.clearFilters}
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(null)}
            className="mb-2"
          >
            {content.allCategories}
          </Button>
          
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(
                selectedCategory === category.slug ? null : category.slug
              )}
              className="mb-2"
            >
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: category.color?.startsWith('#') ? category.color : '#6B7280' }}
              ></div>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-aqua-400/10 rounded-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-aqua-300 font-medium">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-2 py-1 bg-aqua-400/10 text-aqua-300 text-xs rounded-md">
                Category: {selectedName}
                <button
                  onClick={() => onCategoryChange(null)}
                  className="ml-1 text-aqua-400 hover:text-aqua-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center px-2 py-1 bg-aqua-400/10 text-aqua-300 text-xs rounded-md">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 text-aqua-400 hover:text-aqua-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
