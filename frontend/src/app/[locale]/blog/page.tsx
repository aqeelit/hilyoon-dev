import BlogPage from '@/components/blog/BlogPage'
import { locales, type Locale } from '@/types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = (locales.includes(raw as Locale) ? raw : 'en') as Locale

  const titles: Record<Locale, string> = {
    en: 'Blog - AI Insights & Updates | Hilyoon',
    ro: 'Blog - Perspective AI și Actualizări | Hilyoon',
    ar: 'المدونة - رؤى وتحديثات الذكاء الاصطناعي | هيليون'
  }

  const descriptions: Record<Locale, string> = {
    en: 'Discover the latest insights in AI, machine learning, and business automation. Expert articles and industry updates from Hilyoon.',
    ro: 'Descoperă ultimele perspective în AI, învățare automată și automatizarea afacerilor. Articole de experți și actualizări din industrie de la Hilyoon.',
    ar: 'اكتشف أحدث الرؤى في الذكاء الاصطناعي والتعلم الآلي وأتمتة الأعمال. مقالات خبراء وتحديثات الصناعة من هيليون.'
  }

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      type: 'website',
      locale: locale,
    },
  }
}

export default async function BlogRoute({ params }: Props) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return <BlogPage locale={locale as Locale} />
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }))
}
