'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Locale } from '@/types'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  locale: Locale
}

export function Pagination({ currentPage, totalPages, onPageChange, locale }: PaginationProps) {
  const labels = {
    en: {
      previous: 'Previous',
      next: 'Next',
      page: 'Page'
    },
    ro: {
      previous: 'Anterior',
      next: 'Următorul',
      page: 'Pagina'
    },
    ar: {
      previous: 'السابق',
      next: 'التالي',
      page: 'صفحة'
    }
  }

  const content = labels[locale] || labels.en

  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {content.previous}
      </Button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {visiblePages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-slate-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center"
      >
        {content.next}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}
