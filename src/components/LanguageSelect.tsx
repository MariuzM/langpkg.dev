import { useEffect, useState } from 'react'

import { IconArrowRight, IconGithub, IconPackage, IconStar } from '@/components/Icons'
import type { Brand, BrandId } from '@/lib/brands'
import { BRANDS } from '@/lib/brands'
import { formatNumber } from '@/lib/format'
import type { LandingStats } from '@/server/packages'
import { getLandingStats } from '@/server/packages'

const ACCENTS: Record<BrandId, string> = {
  jai: '#AB8B4B',
  odin: '#EE7E1B',
}

const productionHref = (b: Brand): string => `https://${b.host}`

const localHref = (b: Brand, origin: string): string | null => {
  try {
    const u = new URL(origin)
    if (u.hostname === 'localhost' || u.hostname.endsWith('.localhost')) {
      return `${u.protocol}//${b.id}.localhost${u.port ? `:${u.port}` : ''}`
    }
  } catch {
    return null
  }
  return null
}

export const LanguageSelect = () => {
  const [origin, setOrigin] = useState<string | null>(null)
  const [stats, setStats] = useState<LandingStats>({})
  const [hovered, setHovered] = useState<BrandId | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    getLandingStats()
      .then((s) => setStats(s))
      .catch(() => {})
  }, [])

  const brands = Object.values(BRANDS)
  const hoveredBrand = hovered ? BRANDS[hovered] : null
  const accent = hovered ? ACCENTS[hovered] : 'rgba(255,255,255,0.25)'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-bd border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{
                background: hovered ? `${accent}18` : 'rgba(255,255,255,0.05)',
                transition: 'background 0.5s ease',
              }}
            >
              <IconPackage
                size={14}
                style={{
                  color: hovered ? accent : 'rgba(255,255,255,0.4)',
                  transition: 'color 0.5s ease',
                }}
              />
            </div>
            <span
              className="font-mono text-sm font-semibold tracking-tight"
              style={{
                color: hovered ? accent : 'rgba(255,255,255,0.7)',
                transition: 'color 0.5s ease',
              }}
            >
              langpkg
            </span>
          </div>
          <a
            href="https://github.com/MariuzM"
            target="_blank"
            rel="noreferrer"
            className="border-bd flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[13px] text-white/30 transition-all hover:bg-white/5 hover:text-white/60"
          >
            <IconGithub size={12} />
            github
          </a>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: accent,
              transition: 'background 0.5s ease',
              animation: 'pulse 2.4s infinite',
            }}
          />
          <span
            className="font-mono text-[11px] tracking-widest uppercase"
            style={{ color: accent, transition: 'color 0.5s ease' }}
          >
            Package Registry
          </span>
        </div>

        <h1 className="mb-12 text-4xl font-bold tracking-[-0.03em] text-white/90 sm:text-5xl">
          One home for
          <br />
          <span
            style={{
              color: hovered ? accent : 'rgba(255,255,255,0.45)',
              transition: 'color 0.5s ease',
            }}
          >
            {hoveredBrand ? `${hoveredBrand.language} packages.` : 'systems-language packages.'}
          </span>
        </h1>

        {/* <p className="mb-16 max-w-md text-[15px] leading-relaxed text-white/35">
          Browse libraries, bindings, and tools with visibility into activity, versions, and
          health at a glance.
        </p> */}

        <div
          className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
          onMouseLeave={() => setHovered(null)}
        >
          {brands.map((b) => {
            const isHovered = hovered === b.id
            const isOther = hovered !== null && hovered !== b.id
            const ca = ACCENTS[b.id]
            const s = stats[b.id]
            return (
              <a
                key={b.id}
                href={(origin && localHref(b, origin)) ?? productionHref(b)}
                onMouseEnter={() => setHovered(b.id)}
                className="group rounded-xl p-6 text-left"
                style={{
                  background: isHovered ? `${ca}0f` : '#0f1520',
                  border: `1px solid ${isHovered ? `${ca}60` : 'rgba(255,255,255,0.07)'}`,
                  transform: isHovered
                    ? 'scale(1.025) translateY(-2px)'
                    : isOther
                      ? 'scale(0.98)'
                      : 'scale(1)',
                  opacity: isOther ? 0.45 : 1,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isHovered ? `0 0 40px ${ca}22` : 'none',
                }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl font-mono text-xl font-bold"
                    style={{
                      background: `${ca}${isHovered ? '25' : '15'}`,
                      color: ca,
                      transition: 'background 0.35s ease',
                    }}
                  >
                    {b.letter}
                  </div>
                  <IconArrowRight
                    size={16}
                    style={{
                      color: isHovered ? ca : 'rgba(255,255,255,0.2)',
                      transform: isHovered ? 'translateX(2px)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                </div>
                <div
                  className="mb-1 font-mono text-lg font-bold"
                  style={{
                    color: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {b.language}
                </div>
                <div className="mb-2 font-mono text-[12px] text-white/30">{b.host}</div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-white/25">
                  <span className="flex items-center gap-1">
                    <IconPackage size={9} />
                    {s ? `${formatNumber(s.packages)} packages` : 'packages'}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconStar size={9} />
                    {s ? `${formatNumber(s.stars)} stars` : 'stars'}
                  </span>
                </div>
                <div
                  className="mt-2 flex items-center gap-1.5 font-mono text-[12px] font-medium"
                  style={{
                    color: ca,
                    opacity: isHovered ? 1 : 0.6,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  Browse packages <IconArrowRight size={11} />
                </div>
              </a>
            )
          })}
        </div>
      </main>

      <footer className="border-bd border-t">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="font-mono text-[12px] text-white/20">© 2026 langpkg</span>
        </div>
      </footer>
    </div>
  )
}
