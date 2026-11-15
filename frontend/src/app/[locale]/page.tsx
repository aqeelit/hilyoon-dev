import HomePage from '@/components/HomePage'
import { locales, type Locale } from '@/types'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    locale: string
  }>
}

export default async function LocalePage({ params }: Props) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <HomePage locale={locale as Locale} />
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }))
}
