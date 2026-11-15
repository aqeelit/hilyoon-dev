import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/content/projects'
import type { Locale } from '@/types'

/** Wide featured card for a project (projects page + homepage). */
export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const c = project.content[locale]
  const gradient = `linear-gradient(90deg, ${project.accent.from}, ${project.accent.to})`
  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className="surface group relative grid overflow-hidden transition duration-300 hover:border-ember-500/50 lg:grid-cols-5"
    >
      {/* Visual */}
      <div className="relative min-h-[16rem] overflow-hidden border-b border-white/[0.07] lg:col-span-2 lg:border-b-0 lg:border-e">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 20%, ${project.accent.from}40, transparent 60%), radial-gradient(ellipse at 80% 90%, ${project.accent.to}30, transparent 60%)` }} />
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8">
          <Image src={project.logo} alt="" width={88} height={88} className="h-20 w-20 rounded-3xl shadow-2xl shadow-cyan-500/30 transition duration-500 group-hover:scale-105" />
          <span className="text-2xl font-bold text-white">{c.name}</span>
        </div>
      </div>
      {/* Copy */}
      <div className="flex flex-col p-7 sm:p-9 lg:col-span-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="tag-brand">{c.ui.builtBy}</span>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{c.category} · {project.year}</p>
        </div>
        <h3 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">{c.tagline}</h3>
        <p className="mt-4 line-clamp-3 text-slate-400">{c.summary}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          {c.stats.map((s) => (
            <div key={s.label}>
              <div className="bg-clip-text text-2xl font-bold text-transparent" style={{ backgroundImage: gradient }}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {c.stack.slice(0, 6).map((s) => (
            <span key={s} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs text-slate-400">{s}</span>
          ))}
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
          {c.ui.viewProject}
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
        </span>
      </div>
    </Link>
  )
}
