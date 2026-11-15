import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Locale utilities
export const locales = ['en', 'ro', 'ar'] as const
export type Locale = typeof locales[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getDefaultLocale(): Locale {
  return 'en'
}

// Text direction utility
export function getTextDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr'
}

// Content utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function formatDate(date: string, locale: Locale = 'en'): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// SEO utilities
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '')
  return truncateText(plainText, maxLength)
}
