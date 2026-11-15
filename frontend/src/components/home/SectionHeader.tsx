import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'start'
  className?: string
}

export function SectionHeader({ eyebrow, title, description, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' ? 'mx-auto text-center' : 'text-start', className)}>
      <p className={cn('eyebrow flex items-center gap-3', align === 'center' && 'justify-center')}>
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-ember-500 rtl:bg-gradient-to-l" />
        {eyebrow}
        {align === 'center' && <span className="h-px w-6 bg-gradient-to-l from-transparent to-ember-500 rtl:bg-gradient-to-r" />}
      </p>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-slate-400 sm:text-lg">{description}</p>}
    </div>
  )
}
