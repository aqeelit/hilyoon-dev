import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection'
import { Hero } from '@/components/home/Hero'
import { TechStrip, Solutions, Approach, Services, Industries, WhyUs, CtaBand } from '@/components/home/Sections'
import { Faq } from '@/components/home/Faq'
import { Contact } from '@/components/home/Contact'
import { ProjectsSection } from '@/components/projects/ProjectsSection'
import { getHomeContent } from '@/content/home'
import { Locale } from '@/types'

interface HomePageProps {
  locale: Locale
}

export default function HomePage({ locale }: HomePageProps) {
  const c = getHomeContent(locale)

  return (
    <div className="min-h-screen bg-white">
      <Navigation locale={locale} />
      <main>
        <Hero locale={locale} content={c.hero} />
        <TechStrip content={c.stack} />
        <Solutions content={c.solutions} />
        <ProjectsSection locale={locale} eyebrow={c.nav.projects} />
        <Approach content={c.approach} />
        <Services locale={locale} content={c.services} />
        <Industries content={c.industries} />
        <WhyUs content={c.why} />
        <CtaBand locale={locale} content={c.cta} />
        <Faq content={c.faq} />
        <BlogPreviewSection locale={locale} />
        <Contact content={c.contact} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
