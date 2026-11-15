'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Globe, Menu, X } from 'lucide-react'
import { getHomeContent } from '@/content/home'
import { icons } from '@/components/home/icons'
import { locales, type Locale } from '@/types'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/brand/Logo'

interface NavigationProps {
  locale: Locale
}

const localeLabels: Record<Locale, string> = { en: 'EN', ro: 'RO', ar: 'AR' }

export function Navigation({ locale }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState<'services' | 'industries' | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || `/${locale}`
  const content = getHomeContent(locale)
  const t = content.nav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile drawer on navigation
  useEffect(() => setMobileOpen(false), [pathname])

  // Same page in another language
  const switchLocale = (target: Locale) => {
    const parts = pathname.split('/')
    if (locales.includes(parts[1] as Locale)) parts[1] = target
    else parts.splice(1, 0, target)
    return parts.join('/') || `/${target}`
  }

  const home = `/${locale}`
  const services = content.services.items
  const industries = content.industries.items

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-all',
        scrolled || mobileOpen ? 'border-ember-500/20 bg-ink-950/85 backdrop-blur-xl' : 'border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href={home} aria-label="Hilyoon">
          <Logo />
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Services dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
              {t.services}
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute start-1/2 top-full w-[40rem] -translate-x-1/2 pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 rtl:translate-x-1/2">
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-ink-900/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl">
                {services.map((s) => {
                  const Icon = icons[s.icon]
                  return (
                    <Link key={s.title} href={`${home}#services`} className="flex gap-3 rounded-xl p-3 transition hover:bg-white/[0.05]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-aqua-400/25 bg-aqua-400/10 text-aqua-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">{s.title}</span>
                        <span className="mt-0.5 line-clamp-1 block text-xs text-slate-400">{s.description}</span>
                      </span>
                    </Link>
                  )
                })}
                <Link
                  href={`${home}#services`}
                  className="col-span-2 mt-1 flex items-center justify-center gap-1 rounded-xl bg-white/[0.04] py-2.5 text-sm font-semibold text-aqua-300 transition hover:bg-aqua-400/10"
                >
                  {t.allServices}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Industries dropdown */}
          <div className="group relative">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
              {t.industries}
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="invisible absolute start-0 top-full w-72 pt-3 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl">
                {industries.map((ind) => {
                  const Icon = icons[ind.icon]
                  return (
                    <Link key={ind.name} href={`${home}#industries`} className="flex items-center gap-3 rounded-xl p-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white">
                      <Icon className="h-4 w-4 text-gold-300" />
                      {ind.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <Link href={`${home}/projects`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
            {t.projects}
          </Link>
          <Link href={`${home}#approach`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
            {t.approach}
          </Link>
          <Link href={`${home}/blog`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
            {t.blog}
          </Link>
          <Link href={`${home}#contact`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">
            {t.contact}
          </Link>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <Globe className="h-4 w-4 text-slate-500" />
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                className={cn('rounded-md px-2 py-1', l === locale ? 'bg-aqua-400/15 text-aqua-300' : 'text-slate-500 hover:text-white')}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <Link
            href={`${home}#contact`}
            className="btn-primary !px-5 !py-2.5"
          >
            {t.cta}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-white/[0.07] bg-ink-950 px-5 pb-8 lg:hidden">
          {(['services', 'industries'] as const).map((key) => (
            <div key={key} className="border-b border-white/[0.06]">
              <button
                className="flex w-full items-center justify-between py-4 text-base font-medium text-white"
                onClick={() => setMobileMenu(mobileMenu === key ? null : key)}
              >
                {t[key]}
                <ChevronDown className={cn('h-5 w-5 transition-transform', mobileMenu === key && 'rotate-180')} />
              </button>
              {mobileMenu === key && (
                <div className="space-y-1 pb-4">
                  {(key === 'services' ? services.map((s) => s.title) : industries.map((i) => i.name)).map((label) => (
                    <Link key={label} href={`${home}#${key}`} className="block rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/[0.05] hover:text-white">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {[
            { label: t.projects, href: `${home}/projects` },
            { label: t.approach, href: `${home}#approach` },
            { label: t.blog, href: `${home}/blog` },
            { label: t.contact, href: `${home}#contact` },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-white/[0.06] py-4 text-base font-medium text-white">
              {item.label}
            </Link>
          ))}
          <div className="mt-5 flex items-center gap-2">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocale(l)}
                className={cn('rounded-md px-3 py-1.5 text-sm font-semibold', l === locale ? 'bg-aqua-400 text-ink-950' : 'bg-white/[0.06] text-slate-300')}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>
          <Link
            href={`${home}#contact`}
            className="btn-primary mt-6 w-full"
          >
            {t.cta}
          </Link>
        </div>
      )}
    </header>
  )
}
