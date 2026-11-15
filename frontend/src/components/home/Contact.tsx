'use client'

import { useState, type FormEvent } from 'react'
import { Clock, Mail, Send } from 'lucide-react'
import type { HomeContent } from '@/content/home'
import { SectionHeader } from './SectionHeader'

export function Contact({ content }: { content: HomeContent['contact'] }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })

  const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  // No email backend yet: hand the message to the visitor's mail client
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `AI project inquiry — ${form.company || form.name}`
    const body = `${form.message}\n\n${form.name}\n${form.email}${form.company ? `\n${form.company}` : ''}`
    window.location.href = `mailto:${content.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const input =
    'w-full rounded-xl border border-white/10 bg-ink-950/70 px-4 py-3 text-white placeholder:text-slate-600 transition focus:border-aqua-400/60 focus:outline-none focus:ring-2 focus:ring-aqua-400/20'

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-ink-950 py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute end-[-10rem] top-10 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <SectionHeader align="start" eyebrow={content.eyebrow} title={content.title} description={content.description} />
          <div className="mt-10 space-y-5">
            <a href={`mailto:${content.email}`} className="flex items-center gap-4 text-slate-300 transition hover:text-aqua-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-aqua-400/25 bg-aqua-400/10 text-aqua-300">
                <Mail className="h-5 w-5" />
              </span>
              <span className="font-medium" dir="ltr">{content.email}</span>
            </a>
            <div className="flex items-center gap-4 text-slate-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-aqua-400/25 bg-aqua-400/10 text-aqua-300">
                <Clock className="h-5 w-5" />
              </span>
              <span>{content.responseTime}</span>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="surface p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">{content.form.name}</span>
              <input required value={form.name} onChange={update('name')} className={input} autoComplete="name" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">{content.form.email}</span>
              <input required type="email" value={form.email} onChange={update('email')} className={input} autoComplete="email" dir="ltr" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">{content.form.company}</span>
              <input value={form.company} onChange={update('company')} className={input} autoComplete="organization" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-300">{content.form.message}</span>
              <textarea required rows={5} value={form.message} onChange={update('message')} className={input} />
            </label>
          </div>
          <button
            type="submit"
            className="btn-primary mt-6 w-full"
          >
            {content.form.submit}
            <Send className="h-4 w-4 rtl:-scale-x-100" />
          </button>
          <p className="mt-3 text-center text-xs text-slate-600">{content.form.note}</p>
        </form>
      </div>
    </section>
  )
}
