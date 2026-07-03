import { Link } from '@tanstack/react-router'

import { IconGithub } from './Icons'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => (
  <header
    className="border-bd sticky top-0 z-20 flex h-15 items-center justify-between border-b px-6.5"
    style={{
      background: 'color-mix(in srgb,var(--bg) 82%,transparent)',
      backdropFilter: 'blur(12px)',
    }}
  >
    <div className="flex items-center gap-3.5">
      <Logo />
      <span className="border-chipbd bg-chip text-mut hidden items-center gap-1.75 rounded-[20px] border px-2 py-1 font-mono text-[10.5px] sm:inline-flex">
        <span
          className="bg-ok size-1.5 rounded-full"
          style={{ animation: 'pulse 2.4s infinite' }}
        />
        auto-synced hourly
      </span>
    </div>

    <div className="flex items-center gap-5.5">
      <nav className="text-mut flex gap-5.5 font-sans text-[13.5px] font-medium">
        <Link
          to="/packages"
          search={{ sort: 'stars' }}
          className="hover:text-tx transition-colors"
          activeProps={{ className: 'text-tx' }}
        >
          Browse
        </Link>
      </nav>
      <div className="bg-bd h-5 w-px" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <a
          href="https://github.com/MariuzM/jaipkg"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="border-chipbd bg-chip text-mut hover:border-acc hover:text-tx flex size-7.5 items-center justify-center rounded-lg border transition"
        >
          <IconGithub />
        </a>
      </div>
    </div>
  </header>
)
