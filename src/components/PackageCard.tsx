import { Link } from '@tanstack/react-router'

import { formatNumber, formatRelativeDate, formatVersion } from '@/lib/format'
import { isTrending } from '@/lib/pkg'
import { getTagClass } from '@/lib/tags'
import type { Package } from '@/lib/types'

import { IconClock, IconGitFork, IconPackage, IconStar, IconZap } from './Icons'

type Props = {
  pkg: Package
}

export const PackageCard = ({ pkg }: Props) => {
  const tags = pkg.topics.length > 0 ? pkg.topics.slice(0, 3) : [pkg.kind]

  return (
    <Link
      to="/packages/$owner/$repo"
      params={{ owner: pkg.owner, repo: pkg.name }}
      className="group bg-card border-bd relative flex cursor-pointer flex-col gap-3 rounded-lg border p-5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.03]"
    >
      {isTrending(pkg) && (
        <div className="text-acc bg-accsoft border-accbd absolute top-3 right-3 flex items-center gap-1 rounded-lg border px-2 py-0.5 font-mono text-[10px] font-medium">
          <IconZap size={9} />
          HOT
        </div>
      )}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
          <IconPackage size={13} className="text-white/30" />
        </div>
        <div className="min-w-0">
          <div className="group-hover:text-acc truncate font-mono text-sm font-semibold tracking-tight text-white/85 transition-colors">
            {pkg.name}
          </div>
          <div className="font-mono text-[11px] text-white/30">
            {formatVersion(pkg.version) ?? pkg.license ?? pkg.owner}
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-white/50">
        {pkg.description || 'No description provided.'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-lg border px-1.5 py-0.5 font-mono text-[10px] ${getTagClass(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="border-bd mt-auto flex items-center justify-between border-t pt-2">
        <div className="flex items-center gap-3 font-mono text-[11px] text-white/30">
          <span className="flex items-center gap-1">
            <IconStar size={10} />
            {formatNumber(pkg.stars)}
          </span>
          <span className="flex items-center gap-1">
            <IconGitFork size={10} />
            {formatNumber(pkg.forks)}
          </span>
          <span className="flex items-center gap-1">
            <IconClock size={10} />
            {formatRelativeDate(pkg.pushedAt)}
          </span>
        </div>
        <span className="truncate pl-2 font-mono text-[11px] text-white/20">@{pkg.owner}</span>
      </div>
    </Link>
  )
}
