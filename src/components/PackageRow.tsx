import { Link } from '@tanstack/react-router'

import { formatNumber, formatRelativeDate, formatVersion } from '@/lib/format'
import { isTrending, ownerInitial } from '@/lib/pkg'
import { getTagClass } from '@/lib/tags'
import type { Package } from '@/lib/types'

import { IconArchive, IconClock, IconGitFork, IconStar, IconZap } from './Icons'

type Props = {
  pkg: Package
}

export const PackageRow = ({ pkg }: Props) => (
  <Link
    to="/packages/$owner/$repo"
    params={{ owner: pkg.owner, repo: pkg.name }}
    className="group bg-card border-bd flex cursor-pointer items-start gap-4 rounded-lg border p-5 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.03]"
  >
    <div className="bg-accsoft text-acc flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-base font-bold">
      {ownerInitial(pkg.name)}
    </div>
    <div className="min-w-0 flex-1">
      <div className="mb-1 flex flex-wrap items-center gap-2.5">
        <span className="font-mono text-[14px] font-semibold text-white/85 transition-colors group-hover:text-white">
          {pkg.name}
        </span>
        {pkg.version && (
          <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/30">
            {formatVersion(pkg.version)}
          </span>
        )}
        <span
          className={`rounded-lg border px-1.5 py-0.5 font-mono text-[10px] ${getTagClass(pkg.kind)}`}
        >
          {pkg.kind}
        </span>
        {isTrending(pkg) && (
          <span className="text-acc bg-accsoft border-accbd flex items-center gap-1 rounded-lg border px-1.5 py-0.5 font-mono text-[10px]">
            <IconZap size={8} />
            hot
          </span>
        )}
        {pkg.archived && (
          <span className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/30">
            <IconArchive size={9} />
            archived
          </span>
        )}
      </div>
      <p className="mb-2.5 text-[13px] leading-relaxed text-white/45">
        {pkg.description || 'No description provided.'}
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-1.5">
          {pkg.topics.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className={`rounded-lg border px-1.5 py-0.5 font-mono text-[10px] ${getTagClass(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 font-mono text-[11px] text-white/25">
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
          <span>@{pkg.owner}</span>
        </div>
      </div>
    </div>
  </Link>
)
