import { useBrand } from '@/lib/useBrand'

import { IconGithub, IconPackage } from './Icons'

export const Footer = () => {
  const brand = useBrand()
  return (
    <footer className="border-bd mt-20 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="bg-accsoft flex h-5 w-5 items-center justify-center rounded-lg">
            <IconPackage size={10} className="text-acc" />
          </div>
          <span className="font-mono text-[12px] text-white/25">
            langpkg/{brand.id} — community maintained
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[12px] text-white/25">
          <span>© 2026</span>
          <a
            href={`https://github.com/${brand.repo}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-white/50"
          >
            <IconGithub size={11} />
            source
          </a>
        </div>
      </div>
    </footer>
  )
}
