import { notFound } from 'next/navigation'

// Developer diagnostics page: never served in production builds.
export default function ApiTestLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') notFound()
  return children
}
