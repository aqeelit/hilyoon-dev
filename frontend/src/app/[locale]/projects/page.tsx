import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { ProjectsSection } from '@/components/projects/ProjectsSection'
import { projects } from '@/content/projects'
import { getHomeContent } from '@/content/home'
import { locales, type Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = (locales.includes(raw as Locale) ? raw : 'en') as Locale
  const ui = projects[0].content[locale].ui
  return { title: `${ui.projectsTitle} | Hilyoon`, description: ui.projectsSubtitle }
}

export default async function ProjectsRoute({ params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  const l = locale as Locale
  return (
    <div className="min-h-screen bg-ink-950">
      <Navigation locale={l} />
      <main>
        <ProjectsSection locale={l} eyebrow={getHomeContent(l).nav.projects} asPage />
      </main>
      <Footer locale={l} />
    </div>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
