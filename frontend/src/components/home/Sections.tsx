import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { HomeContent } from '@/content/home'
import { techStack } from '@/content/home'
import type { Locale } from '@/types'
import { SectionHeader } from './SectionHeader'
import { icons } from './icons'

/* ------------------------------------------------------------------ */
/* Tech stack marquee                                                  */
/* ------------------------------------------------------------------ */
export function TechStrip({ content }: { content: HomeContent['stack'] }) {
  const items = [...techStack, ...techStack]
  return (
    <section className="relative bg-ink-950 py-12">
      <div className="hairline absolute inset-x-0 top-0" />
      <p className="px-5 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{content.title}</p>
      <div dir="ltr" className="relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-12 motion-reduce:animate-none">
          {items.map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-12 whitespace-nowrap text-lg font-semibold text-slate-500 transition hover:text-aqua-300">
              {name}
              <span className="h-1 w-1 rounded-full bg-ember-500/60" />
            </span>
          ))}
        </div>
      </div>
      <div className="hairline absolute inset-x-0 bottom-0" />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Solutions (what we build) with small custom illustrations           */
/* ------------------------------------------------------------------ */
function DocArt() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" fill="none">
      <rect x="40" y="22" width="110" height="128" rx="10" fill="#0D1626" stroke="rgba(255,255,255,0.12)" />
      {[44, 60, 76, 92, 108].map((y, i) => (
        <rect key={y} x="56" y={y} width={i % 2 ? 60 : 78} height="6" rx="3" fill="rgba(148,163,184,0.35)" />
      ))}
      <rect x="52" y="70" width="86" height="16" rx="4" stroke="#2EE0C8" strokeDasharray="4 3" />
      <path d="M160 78 H196" stroke="url(#doc-l)" strokeWidth="2" />
      <defs>
        <linearGradient id="doc-l" x1="160" y1="0" x2="196" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2EE0C8" /><stop offset="1" stopColor="#F5B947" />
        </linearGradient>
      </defs>
      <rect x="200" y="40" width="88" height="76" rx="10" fill="#0D1626" stroke="rgba(46,224,200,0.45)" />
      {['invoice_no', 'total', 'due_date'].map((k, i) => (
        <g key={k}>
          <rect x="212" y={54 + i * 18} width="30" height="6" rx="3" fill="#2EE0C8" opacity="0.8" />
          <rect x="248" y={54 + i * 18} width="28" height="6" rx="3" fill="#F5B947" opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}

function AgentArt() {
  const nodes = [[70, 80], [150, 40], [150, 120], [235, 80], [290, 40]]
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]]
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" fill="none">
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgba(46,224,200,0.45)" strokeDasharray="3 4" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={i === 3 ? 18 : 12} fill="#0D1626" stroke={i === 3 ? '#F5B947' : '#2EE0C8'} strokeWidth="1.5" />
          <circle cx={x} cy={y} r="3.5" fill={i === 3 ? '#F5B947' : '#2EE0C8'} />
        </g>
      ))}
    </svg>
  )
}

function VisionArt() {
  return (
    <svg viewBox="0 0 320 160" className="h-full w-full" fill="none">
      <rect x="30" y="18" width="260" height="126" rx="12" fill="#0D1626" stroke="rgba(255,255,255,0.1)" />
      <path d="M30 120 L95 70 L140 100 L200 52 L290 112 V132 a12 12 0 0 1 -12 12 H42 a12 12 0 0 1 -12 -12Z" fill="rgba(46,224,200,0.12)" />
      <rect x="84" y="56" width="70" height="56" rx="4" stroke="#2EE0C8" strokeWidth="1.5" />
      <rect x="84" y="44" width="54" height="12" rx="3" fill="#2EE0C8" />
      <rect x="186" y="40" width="58" height="46" rx="4" stroke="#F5B947" strokeWidth="1.5" />
      <rect x="186" y="28" width="46" height="12" rx="3" fill="#F5B947" />
    </svg>
  )
}

const solutionArt = [DocArt, AgentArt, VisionArt]

export function Solutions({ content }: { content: HomeContent['solutions'] }) {
  return (
    <section className="bg-ink-950 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />
        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
          {content.items.map((item, i) => {
            const Art = solutionArt[i % solutionArt.length]
            return (
              <article key={item.title} className="surface surface-hover group overflow-hidden">
                <div className="relative h-44 border-b border-white/[0.06] bg-[radial-gradient(ellipse_at_top,rgba(46,224,200,0.14),transparent_70%)]">
                  <Art />
                  <span className="absolute bottom-3 start-4 rounded-full border border-ember-500/40 bg-ink-950/85 px-3 py-1 text-xs font-semibold text-ember-200 backdrop-blur">
                    {item.industry}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold leading-snug text-white sm:text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs font-medium text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Approach + stats                                                    */
/* ------------------------------------------------------------------ */
export function Approach({ content }: { content: HomeContent['approach'] }) {
  return (
    <section id="approach" className="relative scroll-mt-20 overflow-hidden bg-ink-900 py-24 sm:py-28">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => {
            const Icon = icons[item.icon]
            return (
              <li key={item.title} className="surface surface-hover relative p-6">
                <span className="absolute end-5 top-5 font-mono text-xs text-ember-400/70" dir="ltr">0{i + 1}</span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-aqua-400/30 bg-aqua-400/10 text-aqua-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </li>
            )
          })}
        </ol>

        <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-r from-aqua-400/[0.07] via-ink-850 to-gold-400/[0.07] sm:grid-cols-3">
          {content.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-6 py-9 text-center ${i > 0 ? 'border-t border-white/[0.07] sm:border-s sm:border-t-0' : ''}`}
            >
              <div className="text-gradient-brand text-4xl font-bold sm:text-5xl">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Services grid                                                       */
/* ------------------------------------------------------------------ */
export function Services({ locale, content }: { locale: Locale; content: HomeContent['services'] }) {
  return (
    <section id="services" className="scroll-mt-20 bg-ink-950 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeader align="start" eyebrow={content.eyebrow} title={content.title} description={content.description} />
          <Link href={`/${locale}#contact`} className="btn-ghost shrink-0 !px-5 !py-2.5">
            {content.learnMore}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => {
            const Icon = icons[item.icon]
            // Alternate aqua / gold accents across the grid
            const gold = i % 2 === 1
            return (
              <Link
                key={item.title}
                href={`/${locale}#contact`}
                className="surface group relative flex flex-col overflow-hidden p-7 transition duration-300 hover:border-ember-500/50"
              >
                {/* hover glow */}
                <span aria-hidden className="pointer-events-none absolute -top-24 end-[-6rem] h-48 w-48 rounded-full bg-aqua-400/0 blur-3xl transition duration-500 group-hover:bg-aqua-400/20" />
                <Icon className={`relative h-7 w-7 ${gold ? 'text-gold-300' : 'text-aqua-300'}`} />
                <h3 className="relative mt-6 text-lg font-semibold text-white">{item.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
                <ArrowUpRight className="relative mt-6 h-5 w-5 text-slate-600 transition group-hover:text-aqua-300 rtl:-scale-x-100" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Industries                                                          */
/* ------------------------------------------------------------------ */
export function Industries({ content }: { content: HomeContent['industries'] }) {
  return (
    <section id="industries" className="scroll-mt-20 bg-ink-900 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => {
            const Icon = icons[item.icon]
            return (
              <div key={item.name} className="surface surface-hover p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-ember-500/30 bg-ember-500/10 text-ember-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {item.useCases.map((u) => (
                    <li key={u} className="flex items-center gap-2 text-sm text-slate-400">
                      <Check className="h-4 w-4 shrink-0 text-aqua-400" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Why Hilyoon                                                         */
/* ------------------------------------------------------------------ */
export function WhyUs({ content }: { content: HomeContent['why'] }) {
  return (
    <section id="why" className="relative scroll-mt-20 overflow-hidden bg-ink-950 py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute start-[-12rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-aqua-500/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">
        <div className="lg:col-span-2">
          <SectionHeader align="start" eyebrow={content.eyebrow} title={content.title} className="lg:sticky lg:top-28" />
        </div>
        <ol className="space-y-5 lg:col-span-3">
          {content.items.map((item, i) => (
            <li key={item.title} className="surface surface-hover flex gap-5 p-6 sm:gap-6 sm:p-8">
              <span className="text-gradient-brand shrink-0 font-mono text-3xl font-bold sm:text-4xl" dir="ltr">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */
export function CtaBand({ locale, content }: { locale: Locale; content: HomeContent['cta'] }) {
  return (
    <section className="bg-ink-950 px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="border-glow mx-auto max-w-7xl rounded-[2rem]">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 px-6 py-16 text-center sm:px-16 sm:py-20">
          <div aria-hidden className="absolute -top-32 start-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-aqua-400/20 blur-[100px] rtl:translate-x-1/2" />
          <div aria-hidden className="absolute -bottom-32 end-0 h-64 w-64 rounded-full bg-gold-400/15 blur-[90px]" />
          <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <h2 className="relative mx-auto max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">{content.title}</h2>
          <p className="relative mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">{content.description}</p>
          <Link href={`/${locale}#contact`} className="btn-primary group relative mt-9">
            {content.button}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  )
}
