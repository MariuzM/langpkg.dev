import { Link } from '@tanstack/react-router'

import { useBrand } from '@/lib/useBrand'

export const Logo = () => {
  const brand = useBrand()
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="bg-accbrandsoft text-accbrand flex h-7 w-7 items-center justify-center rounded-lg font-mono text-sm font-bold">
        {brand.letter}
      </div>
      <span className="font-mono text-sm font-semibold tracking-tight text-white/80">
        langpkg<span className="text-accbrand">/{brand.id}</span>
      </span>
    </Link>
  )
}
