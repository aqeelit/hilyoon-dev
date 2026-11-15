import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Mail, Monitor, Globe2, ShieldCheck, ScanLine, Brain, FileText, Info } from 'lucide-react'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { SectionHeader } from '@/components/home/SectionHeader'
import type { Project } from '@/content/projects'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

const groupIcons = [ScanLine, Brain, FileText, ShieldCheck]

/** Illustrative mock of the MedPredix three-panel web workspace. */
function WorkspaceMock({ project, locale }: { project: Project; locale: Locale }) {
  const c = project.content[locale]
  const [sources, analysis, studio] = c.ui.interfacePanels
  return (
    <figure className="surface overflow-hidden" dir="ltr">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-gold-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ms-3 truncate text-xs text-slate-500">{c.ui.interfaceLabel}</span>
        <span className="ms-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">{c.ui.illustration}</span>
      </div>
      <div className="grid grid-cols-12 gap-px bg-white/[0.06] text-[11px]">
        {/* Sources */}
        <div className="col-span-3 hidden bg-ink-900 p-3 sm:block">
          <p className="mb-3 font-semibold uppercase tracking-wider text-slate-500">{sources}</p>
          {['CHEST_PA.dcm', 'BRAIN_T1.dcm', 'COLON_CT.dcm', 'CHEST_LAT.dcm'].map((f, i) => (
            <div key={f} className={cn('mb-1.5 flex items-center gap-2 rounded-md px-2 py-1.5', i === 0 ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-400')}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? project.accent.from : '#334155' }} />
              <span className="truncate font-mono">{f}</span>
            </div>
          ))}
        </div>
        {/* Analysis */}
        <div className="col-span-12 bg-ink-950 p-3 sm:col-span-6">
          <p className="mb-3 font-semibold uppercase tracking-wider text-slate-500">{analysis}</p>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black">
            <svg viewBox="0 0 200 150" className="h-full w-full" fill="none">
              <defs>
                <radialGradient id="xr" cx="50%" cy="45%" r="60%">
                  <stop stopColor="#9ca3af" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#000" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="100" cy="72" rx="78" ry="62" fill="url(#xr)" />
              <path d="M100 18 V130" stroke="#d1d5db" strokeOpacity="0.5" strokeWidth="3" />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <g key={i} stroke="#e5e7eb" strokeOpacity={0.35 - i * 0.03} strokeWidth="2">
                  <path d={`M98 ${34 + i * 15} C 70 ${30 + i * 15}, 45 ${40 + i * 15}, 32 ${56 + i * 14}`} />
                  <path d={`M102 ${34 + i * 15} C 130 ${30 + i * 15}, 155 ${40 + i * 15}, 168 ${56 + i * 14}`} />
                </g>
              ))}
              <rect x="122" y="70" width="38" height="34" rx="3" stroke={project.accent.to} strokeWidth="1.5" strokeDasharray="4 3" />
              <rect x="122" y="60" width="38" height="10" rx="2" fill={project.accent.to} />
            </svg>
            <span className="absolute end-2 top-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">W 400 · L 40</span>
          </div>
          <div className="mt-3 rounded-lg border border-white/[0.07] bg-ink-900 p-2.5">
            <div className="flex items-center justify-between text-slate-300">
              <span>Pneumonia</span>
              <span className="font-semibold text-emerald-300">0.94</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[94%] rounded-full" style={{ background: `linear-gradient(90deg, ${project.accent.from}, ${project.accent.to})` }} />
            </div>
          </div>
        </div>
        {/* Studio */}
        <div className="col-span-3 hidden bg-ink-900 p-3 sm:block">
          <p className="mb-3 font-semibold uppercase tracking-wider text-slate-500">{studio}</p>
          <div className="space-y-1.5 rounded-md bg-white/[0.03] p-2">
            {[90, 70, 85, 60, 78, 50, 66].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-slate-600/60" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="mt-3 rounded-md px-2 py-1.5 text-center font-semibold text-ink-950" style={{ background: `linear-gradient(90deg, ${project.accent.from}, ${project.accent.to})` }}>
            PDF
          </div>
        </div>
      </div>
    </figure>
  )
}

export function ProjectPage({ project, locale }: { project: Project; locale: Locale }) {
  const c = project.content[locale]
  const gradient = `linear-gradient(90deg, ${project.accent.from}, ${project.accent.to})`
  const mailto = `mailto:${project.contactEmail}?subject=${encodeURIComponent(`${c.name} — ${c.ui.demoButton}`)}`

  return (
    <div className="min-h-screen bg-ink-950">
      <Navigation locale={locale} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 start-[-10%] h-[36rem] w-[36rem] rounded-full blur-[140px]" style={{ background: `${project.accent.from}33` }} />
            <div className="absolute top-20 end-[-10%] h-[30rem] w-[30rem] rounded-full blur-[140px]" style={{ background: `${project.accent.to}22` }} />
            <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-aqua-300">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {c.ui.backToProjects}
            </Link>

            <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="min-w-0">
                <div className="flex items-center gap-4">
                  <Image src={project.logo} alt={`${c.name} logo`} width={56} height={56} className="h-14 w-14 rounded-2xl shadow-lg shadow-cyan-500/20" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{c.category}</p>
                    <p className="tag-brand mt-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
                      {c.status}
                    </p>
                  </div>
                </div>
                <h1 className="mt-6 text-5xl font-bold tracking-tight text-white sm:text-6xl">
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradient }}>{c.name}</span>
                </h1>
                <p className="mt-3 text-xl font-medium text-white sm:text-2xl">{c.tagline}</p>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{c.summary}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={mailto} className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-cyan-500/25 transition hover:brightness-110" style={{ backgroundImage: gradient }}>
                    {c.ui.demoButton}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </a>
                  <a href="#pricing" className="btn-ghost">{c.ui.pricingEyebrow}</a>
                </div>
              </div>
              <div className="min-w-0">
                <WorkspaceMock project={project} locale={locale} />
              </div>
            </div>

            {/* Stats */}
            <dl className="mt-14 grid overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-900/70 sm:grid-cols-3">
              {c.stats.map((s, i) => (
                <div key={s.label} className={cn('px-6 py-8 text-center', i > 0 && 'border-t border-white/[0.07] sm:border-s sm:border-t-0')}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="bg-clip-text text-4xl font-bold text-transparent sm:text-5xl" style={{ backgroundImage: gradient }}>{s.value}</dd>
                  <dd className="mt-2 text-sm text-slate-400">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Value propositions */}
        <section className="bg-ink-900 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow={c.ui.builtBy} title={c.ui.highlightsTitle} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.highlights.map((h) => (
                <li key={h} className="surface flex gap-3 p-5">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" style={{ backgroundImage: gradient }}>
                    <Check className="h-3.5 w-3.5 text-ink-950" />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-300">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Platforms */}
        <section className="bg-ink-950 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow={c.ui.platformsEyebrow} title={c.ui.platformsTitle} />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {c.platforms.map((p, i) => {
                const Icon = i === 0 ? Globe2 : Monitor
                return (
                  <div key={p.title} className="surface surface-hover p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-slate-400" dir="ltr">{p.tech}</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-3 text-sm leading-relaxed text-slate-400">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* AI models */}
        <section className="relative overflow-hidden bg-ink-900 py-20 sm:py-24">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow={c.ui.modelsEyebrow} title={c.ui.modelsTitle} />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {c.models.map((m) => (
                <div key={m.name} className="border-glow rounded-2xl">
                  <div className="h-full rounded-2xl bg-ink-850 p-7 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{m.modality}</p>
                    <p className="mt-5 bg-clip-text text-5xl font-bold text-transparent" style={{ backgroundImage: gradient }} dir="ltr">{m.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{m.metric}</p>
                    <p className="mt-5 text-lg font-semibold text-white">{m.name}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 text-center text-xs text-slate-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {c.disclaimer}
            </p>
          </div>
        </section>

        {/* Capabilities */}
        <section className="bg-ink-950 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow={c.ui.featuresEyebrow} title={c.ui.featuresTitle} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.featureGroups.map((g, i) => {
                const Icon = groupIcons[i % groupIcons.length]
                return (
                  <div key={g.title} className="surface surface-hover p-6">
                    <Icon className="h-7 w-7 text-cyan-300" />
                    <h3 className="mt-5 text-lg font-semibold text-white">{g.title}</h3>
                    <ul className="mt-4 space-y-2.5">
                      {g.items.map((it) => (
                        <li key={it} className="flex gap-2 text-sm leading-relaxed text-slate-400">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-ink-900 py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow={c.ui.pricingEyebrow} title={c.ui.pricingTitle} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.plans.map((plan) => (
                <div
                  key={plan.name}
                  className={cn('surface flex flex-col p-6', plan.highlighted && 'border-cyan-400/50 shadow-[0_20px_60px_-25px_rgba(6,182,212,0.6)]')}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                    {plan.highlighted && <span className="h-2 w-2 rounded-full" style={{ backgroundImage: gradient }} />}
                  </div>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white" dir="ltr">{plan.price}</span>
                    {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2 text-sm text-slate-400">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-white/[0.07] pt-4 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400">{c.ui.audienceLabel}: </span>
                    {plan.audience}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-slate-500">{c.ui.pricingNote}</p>
          </div>
        </section>

        {/* Stack + CTA */}
        <section className="bg-ink-950 px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="eyebrow">{c.ui.stackTitle}</p>
              <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5">
                {c.stack.map((s) => (
                  <span key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-300">{s}</span>
                ))}
              </div>
            </div>

            <div className="border-glow mt-16 rounded-[2rem]">
              <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-14 text-center sm:px-16">
                <div aria-hidden className="absolute -top-32 start-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full blur-[100px] rtl:translate-x-1/2" style={{ background: `${project.accent.from}33` }} />
                <h2 className="relative text-3xl font-bold text-white sm:text-4xl">{c.ui.ctaTitle}</h2>
                <p className="relative mx-auto mt-4 max-w-2xl text-slate-400">{c.ui.ctaDescription}</p>
                <a href={mailto} className="relative mt-8 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink-950 transition hover:brightness-110" style={{ backgroundImage: gradient }}>
                  <Mail className="h-4 w-4" />
                  {c.ui.ctaButton}
                </a>
                <p className="relative mt-3 text-sm text-slate-500" dir="ltr">{project.contactEmail}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
