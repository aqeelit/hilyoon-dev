// Minimal, safe Markdown -> HTML for blog posts.
// All input is HTML-escaped first; only the constructs below are turned into markup.
// Lives under components/ so Tailwind picks up the class names.

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

function inline(text: string): string {
  let s = escapeHtml(text)
  // inline code first so its content isn't formatted further
  const codes: string[] = []
  s = s.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code class="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-aqua-200">${c}</code>`)
    return `\u0000${codes.length - 1}\u0000`
  })
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
  s = s.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
  // links: only http(s), mailto and site-relative URLs
  s = s.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\/)[^\s)]+)\)/g, (_, label, href) => {
    const external = /^https?:/.test(href)
    return `<a href="${href}" class="text-aqua-300 underline decoration-aqua-400/40 underline-offset-4 hover:text-aqua-200"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}</a>`
  })
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)])
}

const headingClass: Record<number, string> = {
  1: 'mt-12 mb-5 text-3xl font-bold text-white',
  2: 'mt-12 mb-4 text-2xl font-bold text-white',
  3: 'mt-10 mb-3 text-xl font-semibold text-white',
  4: 'mt-8 mb-3 text-lg font-semibold text-white',
}

export function renderMarkdown(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let para: string[] = []
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null
  let quote: string[] = []
  let code: string[] | null = null

  const flushPara = () => {
    if (para.length) out.push(`<p class="my-5 leading-8 text-slate-300">${inline(para.join(' '))}</p>`)
    para = []
  }
  const flushList = () => {
    if (!list) return
    const cls = list.type === 'ul' ? 'list-disc' : 'list-decimal'
    out.push(`<${list.type} class="my-5 space-y-2 ps-6 ${cls} marker:text-aqua-400 text-slate-300">${list.items.map((i) => `<li class="leading-7">${inline(i)}</li>`).join('')}</${list.type}>`)
    list = null
  }
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote class="my-6 border-s-2 border-gold-400 bg-gold-400/[0.05] py-3 ps-5 pe-4 italic text-slate-300">${inline(quote.join(' '))}</blockquote>`)
    quote = []
  }
  const flushAll = () => { flushPara(); flushList(); flushQuote() }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (code) {
      if (/^```/.test(line)) {
        out.push(`<pre class="my-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-ink-900 p-4 text-sm leading-6" dir="ltr"><code class="font-mono text-slate-200">${escapeHtml(code.join('\n'))}</code></pre>`)
        code = null
      } else code.push(raw)
      continue
    }
    if (/^```/.test(line)) { flushAll(); code = []; continue }

    const h = line.match(/^(#{1,6})\s+(.*)$/)
    if (h) {
      flushAll()
      // The page title is the h1, so Markdown "#" becomes h2, "##" h3, ... (capped at h5)
      const level = Math.min(h[1].length, 4)
      const tag = `h${level + 1}`
      out.push(`<${tag} class="${headingClass[level]}">${inline(h[2])}</${tag}>`)
      continue
    }

    const ul = line.match(/^\s*[-*+]\s+(.*)$/)
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ul || ol) {
      flushPara(); flushQuote()
      const type = ul ? 'ul' : 'ol'
      if (!list || list.type !== type) { flushList(); list = { type, items: [] } }
      list.items.push((ul ?? ol)![1])
      continue
    }

    const q = line.match(/^>\s?(.*)$/)
    if (q) { flushPara(); flushList(); quote.push(q[1]); continue }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushAll(); out.push('<hr class="my-10 border-white/10" />'); continue }

    if (line.trim() === '') { flushAll(); continue }

    flushList(); flushQuote()
    para.push(line.trim())
  }
  if (code) out.push(`<pre class="my-6 overflow-x-auto rounded-xl bg-ink-900 p-4 text-sm" dir="ltr"><code class="font-mono text-slate-200">${escapeHtml((code as string[]).join('\n'))}</code></pre>`)
  flushAll()
  return out.join('\n')
}
