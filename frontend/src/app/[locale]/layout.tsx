import type { Metadata } from 'next'
import { locales, Locale } from '@/types'
import { notFound } from 'next/navigation'
import { getTextDirection } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = (locales.includes(raw as Locale) ? raw : 'en') as Locale

  const titles = {
    en: 'Hilyoon - AI Engineering Company | LLM Apps, AI Agents & ML',
    ro: 'Hilyoon - Companie de inginerie AI | Aplicații LLM, agenți AI și ML',
    ar: 'هيليون - شركة هندسة الذكاء الاصطناعي | تطبيقات LLM والوكلاء وتعلم الآلة'
  }

  const descriptions = {
    en: 'Hilyoon designs, builds and operates production-grade AI: generative AI and LLM applications, AI agents, RAG, computer vision and MLOps.',
    ro: 'Hilyoon proiectează, construiește și operează AI de producție: AI generativ și aplicații LLM, agenți AI, RAG, viziune computerizată și MLOps.',
    ar: 'تصمم هيليون وتبني وتشغّل ذكاءً اصطناعياً جاهزاً للإنتاج: الذكاء التوليدي وتطبيقات LLM والوكلاء وRAG والرؤية الحاسوبية وMLOps.'
  }

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    metadataBase: new URL('https://hilyoon.com'),
    alternates: {
      canonical: `https://hilyoon.com/${locale}`,
      languages: {
        'en': 'https://hilyoon.com/en',
        'ro': 'https://hilyoon.com/ro',
        'ar': 'https://hilyoon.com/ar',
      },
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: `https://hilyoon.com/${locale}`,
      siteName: 'Hilyoon',
      locale: locale,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Hilyoon - AI Engineering Company',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: ['/og-image.jpg'],
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params

  // Validate locale
  if (!locales.includes(raw as Locale)) {
    notFound()
  }

  const locale = raw as Locale
  const direction = getTextDirection(locale)

  // <html>/<body> come from the root layout; set language and direction here
  return (
    <div lang={locale} dir={direction}>
      {children}
    </div>
  )
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale: locale,
  }))
}
