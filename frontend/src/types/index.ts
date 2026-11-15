// Locale types
export const locales = ['en', 'ro', 'ar'] as const
export type Locale = typeof locales[number]

// Navigation types
export interface NavigationItem {
  label: string
  href: string
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
}

// Content types
export interface LocalizedContent {
  en: unknown
  ro: unknown
  ar: unknown
}

// Blog types
export interface BlogPost {
  id: number
  title: string
  excerpt: string
  content?: string
  category: string
  readTime: string
  date: string
  image: string
  slug: string
  author?: Author
  tags?: string[]
}

export interface Author {
  name: string
  role: string
  avatar: string
  bio?: string
}

// Feature types
export interface Feature {
  icon: React.ComponentType<{ className?: string }> // Lucide icon component
  title: string
  description: string
  benefits?: string[]
}

// Testimonial types
export interface Testimonial {
  name: string
  role: string
  company: string
  avatar: string
  rating: number
  text: string
  metrics?: string
}

// Stats types
export interface Stat {
  number: string
  label: string
}

// Contact types
export interface ContactInfo {
  title: string
  email: string
  phone: string
  address: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface ContactForm {
  name: string
  email: string
  company?: string
  message: string
}

export interface NewsletterForm {
  email: string
}

// SEO types
export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

// Page props types
export interface PageProps {
  params: {
    locale: Locale
  }
}

export interface LayoutProps {
  children: React.ReactNode
  params: {
    locale: Locale
  }
}
