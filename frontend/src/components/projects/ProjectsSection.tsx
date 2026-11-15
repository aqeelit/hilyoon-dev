import { SectionHeader } from '@/components/home/SectionHeader'
import { projects } from '@/content/projects'
import type { Locale } from '@/types'
import { ProjectCard } from './ProjectCard'

/** Projects list, used on the homepage and the /projects page. */
export function ProjectsSection({ locale, eyebrow, asPage = false }: { locale: Locale; eyebrow: string; asPage?: boolean }) {
  const ui = projects[0].content[locale].ui
  return (
    <section id="projects" className={asPage ? 'pt-32 pb-24 sm:pt-40' : 'scroll-mt-20 bg-ink-900 py-24 sm:py-28'}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {asPage ? (
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{ui.projectsTitle}</h1>
            <p className="mt-4 text-lg text-slate-400">{ui.projectsSubtitle}</p>
          </div>
        ) : (
          <SectionHeader eyebrow={eyebrow} title={ui.projectsTitle} description={ui.projectsSubtitle} />
        )}
        <div className="mt-12 space-y-8">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
