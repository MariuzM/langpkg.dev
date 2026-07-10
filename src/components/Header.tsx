import { useEffect, useState } from 'react'
import { Link, useCanGoBack, useMatchRoute, useRouter } from '@tanstack/react-router'

import { LANDING_HOST } from '@/lib/brands'
import { useBrand } from '@/lib/useBrand'

import { IconArrowLeft, IconGithub, IconRefresh } from './Icons'
import { Logo } from './Logo'

export const Header = () => {
  const brand = useBrand()
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const matchRoute = useMatchRoute()
  const onDetail = Boolean(matchRoute({ to: '/packages/$owner/$repo' }))
  const [home, setHome] = useState(`https://${LANDING_HOST}`)

  useEffect(() => {
    const u = new URL(window.location.origin)
    if (u.hostname === 'localhost' || u.hostname.endsWith('.localhost')) {
      setHome(`${u.protocol}//localhost${u.port ? `:${u.port}` : ''}`)
    }
  }, [])

  return (
    <header
      className="border-bd sticky top-0 z-50 border-b"
      style={{ background: 'rgba(8,12,18,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          {onDetail ? (
            <button
              onClick={() => {
                if (canGoBack) router.history.back()
                else router.navigate({ to: '/packages', search: { sort: 'stars' } })
              }}
              className="mr-1 flex items-center gap-1.5 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
            >
              <IconArrowLeft size={11} />
              back
            </button>
          ) : (
            <a
              href={home}
              className="mr-1 flex items-center gap-1.5 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
            >
              <IconArrowLeft size={11} />
              home
            </a>
          )}
          <div className="h-4 w-px bg-white/10" />
          <Logo />
          <span className="border-bd hidden items-center gap-1 rounded-lg border px-2 py-0.5 font-mono text-[10px] text-white/25 sm:flex">
            <IconRefresh size={8} />
            synced hourly
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <Link
            to="/packages"
            search={{ sort: 'stars' }}
            className="rounded-lg px-3 py-1.5 font-mono text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            browse
          </Link>
          <Link
            to="/about"
            className="rounded-lg px-3 py-1.5 font-mono text-[13px] text-white/40 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            about
          </Link>
          <a
            href={`https://github.com/${brand.repo}`}
            target="_blank"
            rel="noreferrer"
            className="border-bd ml-2 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[13px] text-white/40 transition-all hover:bg-white/5 hover:text-white/80"
          >
            <IconGithub size={12} />
            github
          </a>
        </nav>
      </div>
    </header>
  )
}
