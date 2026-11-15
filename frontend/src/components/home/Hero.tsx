'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, RotateCcw, ShieldCheck, UserCheck } from 'lucide-react'
import type { HomeContent } from '@/content/home'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

const STEP_MS = 750
const HOLD_MS = 4500

const statusStyles = {
  done: 'bg-aqua-400/10 text-aqua-300 ring-aqua-400/30',
  verified: 'bg-sky-400/10 text-sky-300 ring-sky-400/30',
  review: 'bg-gold-400/10 text-gold-300 ring-gold-400/40',
  queued: 'bg-white/5 text-slate-400 ring-white/15',
} as const

interface HeroProps {
  locale: Locale
  content: HomeContent['hero']
}

export function Hero({ locale, content }: HeroProps) {
  const [active, setActive] = useState(0)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)

  const demo = content.demos[active]
  const total = demo.steps.length

  // Reveal steps one by one (all at once if the user prefers reduced motion)
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVisibleSteps(total)
      return
    }
    if (visibleSteps < total) {
      const t = setTimeout(() => setVisibleSteps((n) => n + 1), STEP_MS)
      return () => clearTimeout(t)
    }
    if (autoRotate) {
      const t = setTimeout(() => {
        setActive((i) => (i + 1) % content.demos.length)
        setVisibleSteps(0)
      }, HOLD_MS)
      return () => clearTimeout(t)
    }
  }, [visibleSteps, total, autoRotate, content.demos.length])

  const selectTab = useCallback((index: number) => {
    setAutoRotate(false)
    setActive(index)
    setVisibleSteps(0)
  }, [])

  const progress = Math.round((Math.min(visibleSteps, total) / total) * 100)

  return (
    <section className="relative overflow-hidden bg-ink-950 pt-28 pb-20 sm:pt-36 lg:pt-44 lg:pb-32">
      {/* Background: aurora + grid + crescent arc */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-1/3 start-[-10%] h-[42rem] w-[42rem] rounded-full bg-aqua-500/20 blur-[140px] animate-aurora motion-reduce:animate-none" />
        <div className="absolute top-1/4 end-[-15%] h-[34rem] w-[34rem] rounded-full bg-gold-500/[0.12] blur-[140px] animate-aurora [animation-delay:-9s] motion-reduce:animate-none" />
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_70%)]" />
        <svg className="absolute -top-40 end-[-18rem] hidden h-[56rem] w-[56rem] opacity-50 lg:block" viewBox="0 0 800 800" fill="none">
          <defs>
            <linearGradient id="hero-arc" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2EE0C8" stopOpacity="0" />
              <stop offset="0.5" stopColor="#2EE0C8" stopOpacity="0.6" />
              <stop offset="1" stopColor="#F5B947" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d="M620 120 A330 330 0 1 0 700 560 A270 270 0 1 1 620 120 Z" stroke="url(#hero-arc)" strokeWidth="1.2" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Copy */}
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-ember-500/40 bg-ember-500/[0.08] px-4 py-1.5 text-xs font-medium text-ember-200 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
            </span>
            {content.eyebrow}
          </span>

          <h1 className="mt-6 text-[2.35rem] font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[4rem]">
            {content.title}{' '}
            <span className="text-gradient-brand">{content.highlight}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">{content.description}</p>

          <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {content.proof.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                <Check className="h-4 w-4 shrink-0 text-aqua-400" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link href={`/${locale}#contact`} className="btn-primary group">
              {content.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link href={`/${locale}#services`} className="btn-ghost">
              {content.secondary}
            </Link>
          </div>
        </div>

        {/* Agent demo */}
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{content.tabsLabel}</p>
          <div role="tablist" className="mb-4 flex max-w-full overflow-x-auto">
            <div className="inline-flex shrink-0 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {content.demos.map((d, i) => (
                <button
                  key={d.tab}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => selectTab(i)}
                  className={cn(
                    'whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition',
                    i === active ? 'bg-aqua-400 text-ink-950' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {d.tab}
                </button>
              ))}
            </div>
          </div>

          <div className="border-glow rounded-3xl">
            <div className="rounded-3xl bg-ink-900/90 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{demo.title}</h3>
                    <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold-300">
                      {content.example}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{demo.subtitle}</p>
                </div>
                <div className="rounded-2xl border border-aqua-400/25 bg-gradient-to-br from-aqua-400/15 to-gold-400/10 px-4 py-2 text-end">
                  <div className="text-2xl font-bold text-white" dir="ltr">{demo.metric}</div>
                  <div className="text-[11px] text-aqua-200/80">{demo.metricLabel}</div>
                </div>
              </div>

              {/* progress */}
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-brand transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>

              <ol className="relative mt-6 space-y-4">
                <span aria-hidden className="absolute start-[15px] top-2 bottom-2 w-px bg-white/10" />
                {demo.steps.map((step, i) => {
                  const shown = i < visibleSteps
                  return (
                    <li
                      key={`${active}-${i}`}
                      className={cn(
                        'relative flex items-center gap-3 transition-all duration-500 sm:gap-4',
                        shown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                      )}
                    >
                      <span className={cn(
                        'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1',
                        step.status === 'queued'
                          ? 'bg-ink-900 text-slate-500 ring-white/15'
                          : step.status === 'review'
                            ? 'bg-gold-400 text-ink-950 ring-gold-300/50'
                            : 'bg-aqua-400 text-ink-950 ring-aqua-300/50'
                      )}>
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-slate-200">{step.label}</span>
                      <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1', statusStyles[step.status])}>
                        {content.statusLabels[step.status]}
                      </span>
                    </li>
                  )
                })}
              </ol>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 shrink-0 text-aqua-400" />
                  {demo.reviewer}
                </span>
                <button onClick={() => setVisibleSteps(0)} className="flex shrink-0 items-center gap-1.5 text-slate-400 transition hover:text-aqua-300">
                  <RotateCcw className="h-3.5 w-3.5" />
                  {content.replay}
                </button>
              </div>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-gold-400" />
            {content.proof[2]}
          </p>
        </div>
      </div>
    </section>
  )
}
