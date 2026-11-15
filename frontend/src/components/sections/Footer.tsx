import Link from 'next/link'
import { Mail } from 'lucide-react'
import { getHomeContent } from '@/content/home'
import { Logo } from '@/components/brand/Logo'
import type { Locale } from '@/types'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const content = getHomeContent(locale)
  const f = content.footer
  const home = `/${locale}`

  // '#section' -> '/en#section', '/blog' -> '/en/blog'
  const resolve = (href: string) => `${home}${href}`

  return (
    <footer className="relative bg-ink-950 text-slate-400">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href={home} aria-label="Hilyoon">
              <Logo />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-500">{f.tagline}</p>
            <a
              href={`mailto:${content.contact.email}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-aqua-300 hover:text-aqua-200"
            >
              <Mail className="h-4 w-4" />
              <span dir="ltr">{content.contact.email}</span>
            </a>
          </div>

          {f.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ember-400">{col.title}</h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={resolve(link.href)} className="text-sm text-slate-400 transition hover:text-aqua-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/[0.07] pt-8 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Hilyoon. {f.rights}</p>
        </div>
      </div>
    </footer>
  )
}
