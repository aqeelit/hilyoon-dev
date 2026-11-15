import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProjectPage } from '@/components/projects/ProjectPage'
import { getProject, projects } from '@/content/projects'
import { locales, type Locale } from '@/types'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params
  const project = getProject(slug)
  if (!project) return { title: 'Project not found | Hilyoon' }
  const locale = (locales.includes(raw as Locale) ? raw : 'en') as Locale
  const c = project.content[locale]
  return {
    title: `${c.name} — ${c.tagline} | Hilyoon`,
    description: c.summary,
    openGraph: { title: `${c.name} — ${c.tagline}`, description: c.summary, type: 'website', images: [project.logo] },
  }
}

export default async function ProjectRoute({ params }: Props) {
  const { locale, slug } = await params
  const project = getProject(slug)
  if (!project || !locales.includes(locale as Locale)) notFound()
  return <ProjectPage project={project} locale={locale as Locale} />
}

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })))
}
