import Image from 'next/image'
import { cn } from '@/lib/utils'

// Official Hilyoon mark (public/brand/hilyoon-mark.png, 206x383, transparent)
const MARK_W = 206
const MARK_H = 383

/** The Hilyoon "H" mark. Size it by height, e.g. className="h-9 w-auto". */
export function LogoMark({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/hilyoon-mark.png"
      alt=""
      aria-hidden
      width={MARK_W}
      height={MARK_H}
      priority={priority}
      className={cn('h-9 w-auto select-none', className)}
    />
  )
}

/** Mark + wordmark, used in the header and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark priority />
      <span className="text-xl font-bold tracking-tight text-white">Hilyoon</span>
    </span>
  )
}
