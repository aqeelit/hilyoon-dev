'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { HomeContent } from '@/content/home'
import { cn } from '@/lib/utils'
import { SectionHeader } from './SectionHeader'

export function Faq({ content }: { content: HomeContent['faq'] }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20 bg-ink-900 py-24 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} />
        <div className="mt-12 space-y-3">
          {content.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={cn('surface transition', isOpen && 'border-ember-500/45 bg-ink-800/80')}>
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-start"
                  >
                    <span className="text-base font-semibold text-white">{item.q}</span>
                    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition', isOpen ? 'rotate-45 border-ember-500/50 bg-ember-500/10 text-ember-300' : 'border-white/10 text-ember-300')}>
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
                >
                  <p className="overflow-hidden px-6 leading-relaxed text-slate-400">
                    <span className="block pb-5">{item.a}</span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
