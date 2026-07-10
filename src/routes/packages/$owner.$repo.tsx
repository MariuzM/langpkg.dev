import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import {
  IconActivity,
  IconBookOpen,
  IconCalendar,
  IconChevronRight,
  IconClock,
  IconExternalLink,
  IconGitBranch,
  IconGitFork,
  IconGithub,
  IconHash,
  IconPackage,
  IconScale,
  IconShieldCheck,
  IconStar,
  IconTag,
  IconUsers,
} from '@/components/Icons'
import { formatNumber, formatRelativeDate, formatVersion } from '@/lib/format'
import { isMaintained } from '@/lib/pkg'
import { getTagClass } from '@/lib/tags'
import { useBrand } from '@/lib/useBrand'
import { getPackage } from '@/server/packages'

export const Route = createFileRoute('/packages/$owner/$repo')({
  loader: ({ params, context }) =>
    context.resolution.kind === 'brand' ? getPackage({ data: params }) : null,
  head: ({ loaderData, match }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.name} — ${match.context.brand.host}`
          : match.context.brand.host,
      },
      {
        name: 'description',
        content:
          loaderData?.description ??
          `A ${match.context.brand.language} package on ${match.context.brand.host}.`,
      },
    ],
  }),
  errorComponent: PackageNotFound,
  component: PackagePage,
})

function PackageNotFound() {
  const brand = useBrand()
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 text-center">
      <h1 className="font-mono text-xl font-bold text-white/90">Package not found</h1>
      <p className="mt-2 text-sm text-white/50">
        This repository may not exist or is not a {brand.language} project.
      </p>
      <Link
        to="/packages"
        search={{ sort: 'stars' }}
        className="text-acc mt-6 inline-flex font-mono text-sm hover:opacity-80"
      >
        Back to packages
      </Link>
    </div>
  )
}

type Tab = 'readme' | 'versions' | 'deps'

const heatCell = (seed: string, i: number): number => {
  let h = 2166136261
  const s = `${seed}:${i}`
  for (let j = 0; j < s.length; j++) {
    h ^= s.charCodeAt(j)
    h = Math.imul(h, 16777619)
  }
  const intensity = (h >>> 0) / 4294967295
  if (intensity > 0.7) return 0.8
  if (intensity > 0.4) return 0.4
  if (intensity > 0.15) return 0.15
  return 0.04
}

function PackagePage() {
  const pkg = Route.useLoaderData()
  const brand = useBrand()
  const [tab, setTab] = useState<Tab>('readme')

  if (!pkg) return null

  const version = formatVersion(pkg.version)
  const maintained = isMaintained(pkg.pushedAt)

  const metaRows = [
    { icon: <IconHash size={12} />, label: 'Version', value: version ?? '—' },
    { icon: <IconScale size={12} />, label: 'License', value: pkg.license ?? 'Unknown' },
    { icon: <IconUsers size={12} />, label: 'Author', value: `@${pkg.owner}` },
    { icon: <IconTag size={12} />, label: 'Type', value: pkg.kind },
    { icon: <IconGitFork size={12} />, label: 'Forks', value: formatNumber(pkg.forks) },
    {
      icon: <IconCalendar size={12} />,
      label: 'Created',
      value: formatRelativeDate(pkg.createdAt),
    },
    { icon: <IconClock size={12} />, label: 'Updated', value: formatRelativeDate(pkg.pushedAt) },
  ]

  const health = [
    { label: 'maintained', ok: maintained },
    { label: 'has releases', ok: pkg.releases.length > 0 },
    { label: 'has readme', ok: Boolean(pkg.readmeHtml) },
    { label: 'has license', ok: Boolean(pkg.license) },
  ]

  const tabs = [
    { key: 'readme' as const, label: 'Readme', icon: <IconBookOpen size={12} /> },
    {
      key: 'versions' as const,
      label: `Versions (${pkg.releases.length || 1})`,
      icon: <IconGitBranch size={12} />,
    },
    { key: 'deps' as const, label: 'Dependencies', icon: <IconPackage size={12} /> },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* breadcrumb */}
      <div className="mb-8 flex items-center gap-2 font-mono text-[11px] text-white/30">
        <Link to="/packages" search={{ sort: 'stars' }} className="hover:text-white/60">
          packages
        </Link>
        <span className="text-white/15">/</span>
        <Link
          to="/packages"
          search={{ kind: pkg.kind, sort: 'stars' }}
          className="text-white/20 hover:text-white/60"
        >
          {pkg.kind}
        </Link>
        <span className="text-white/15">/</span>
        <span className="text-acc">{pkg.name}</span>
      </div>

      {/* hero */}
      <div className="border-bd pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-accsoft text-acc flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-mono text-2xl font-bold">
              {pkg.name[0].toLowerCase()}
            </div>
            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <h1 className="font-mono text-2xl font-bold tracking-[-0.02em] text-white/90">
                  {pkg.name}
                </h1>
                {version && (
                  <span className="text-acc border-accbd bg-accsoft rounded-lg border px-2 py-0.5 font-mono text-[11px]">
                    {version}
                  </span>
                )}
                <span
                  className={`rounded-lg border px-2 py-0.5 font-mono text-[11px] ${getTagClass(pkg.kind)}`}
                >
                  {pkg.kind}
                </span>
                {pkg.archived && (
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/30">
                    archived
                  </span>
                )}
              </div>
              <p className="mb-3 text-[14px] text-white/50">
                {pkg.description || 'No description provided.'}
              </p>
              <div className="flex flex-wrap items-center gap-4 font-mono text-[12px] text-white/35">
                <span className="flex items-center gap-1.5">
                  <IconStar size={12} className="text-acc" />
                  {formatNumber(pkg.stars)} stars
                </span>
                <span className="flex items-center gap-1.5">
                  <IconGitFork size={12} />
                  {formatNumber(pkg.forks)} forks
                </span>
                <span className="flex items-center gap-1.5">
                  <IconScale size={12} />
                  {pkg.license ?? 'Unknown'}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock size={12} />
                  updated {formatRelativeDate(pkg.pushedAt)}
                </span>
              </div>
            </div>
          </div>
          <a
            href={pkg.url}
            target="_blank"
            rel="noreferrer"
            className="text-acc border-accbd flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-[13px] transition-all hover:bg-white/5"
          >
            <IconGithub size={14} />
            Open repo
            <IconExternalLink size={11} className="opacity-50" />
          </a>
        </div>

        {pkg.topics.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {pkg.topics.map((t) => (
              <Link
                key={t}
                to="/packages"
                search={{ q: t, sort: 'stars' }}
                className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-opacity hover:opacity-80 ${getTagClass(t)}`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* main */}
        <div className="min-w-0 lg:col-span-2">
          <div className="border-bd mb-6 flex items-center gap-1 border-b">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-mono text-[13px] transition-all ${
                  tab === t.key
                    ? 'border-acc text-acc'
                    : 'border-transparent text-white/30 hover:text-white/60'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'readme' && (
            <div className="bg-card border-bd rounded-lg border p-6">
              {pkg.readmeHtml ? (
                <div className="readme" dangerouslySetInnerHTML={{ __html: pkg.readmeHtml }} />
              ) : (
                <p className="font-mono text-[13px] text-white/30">No readme available.</p>
              )}
            </div>
          )}

          {tab === 'versions' && (
            <div className="bg-card border-bd overflow-hidden rounded-lg border">
              {pkg.releases.length === 0 ? (
                <p className="p-6 font-mono text-[13px] text-white/30">No tagged releases.</p>
              ) : (
                pkg.releases.map((r, i) => (
                  <div
                    key={r.tag}
                    className="border-bd flex items-center justify-between border-b px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[13px] text-white/70">{r.tag}</span>
                      {i === 0 && (
                        <span className="text-acc border-accbd bg-accsoft rounded border px-1.5 py-0.5 font-mono text-[10px]">
                          latest
                        </span>
                      )}
                      {r.prerelease && (
                        <span className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/30">
                          pre
                        </span>
                      )}
                      {r.publishedAt && (
                        <span className="font-mono text-[11px] text-white/25">
                          {formatRelativeDate(r.publishedAt)}
                        </span>
                      )}
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-mono text-[11px] text-white/25 transition-colors hover:text-white/50"
                    >
                      view <IconChevronRight size={10} />
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'deps' && (
            <div className="bg-card border-bd rounded-lg border p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <IconShieldCheck size={28} className="mb-3 text-white/15" />
                <div className="font-mono text-sm text-white/30">No dependency manifest</div>
                <div className="mt-1 text-[12px] text-white/20">
                  {brand.language} has no central dependency manifest, so dependency data isn&apos;t
                  available.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd border-b px-5 py-3.5">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Package Info
              </span>
            </div>
            <div>
              {metaRows.map((row) => (
                <div
                  key={row.label}
                  className="border-bd flex items-center justify-between border-b px-5 py-3 last:border-0"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] text-white/30">
                    <span className="text-white/20">{row.icon}</span>
                    {row.label}
                  </div>
                  <span className="font-mono text-[11px] text-white/60">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd border-b px-5 py-3.5">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Health
              </span>
            </div>
            <div className="flex flex-col gap-2.5 px-5 py-4">
              {health.map((h) => (
                <div key={h.label} className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${h.ok ? 'bg-ok' : 'bg-white/15'}`} />
                  <span
                    className={`font-mono text-[12px] ${h.ok ? 'text-white/50' : 'text-white/20'}`}
                  >
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border-bd rounded-lg border p-5">
            <div className="mb-3 font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
              Maintainer
            </div>
            <a
              href={`https://github.com/${pkg.owner}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3"
            >
              <img
                src={pkg.ownerAvatar}
                alt={pkg.owner}
                width={36}
                height={36}
                className="border-bd shrink-0 rounded-lg border"
              />
              <div className="min-w-0">
                <div className="truncate font-mono text-[13px] text-white/70 transition-colors group-hover:text-white/90">
                  {pkg.owner}
                </div>
                <div className="font-mono text-[11px] text-white/25">Maintainer</div>
              </div>
              <IconExternalLink
                size={11}
                className="ml-auto text-white/20 transition-colors group-hover:text-white/40"
              />
            </a>
          </div>

          <div className="bg-card border-bd rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2">
              <IconActivity size={12} className="text-white/25" />
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Activity
              </span>
            </div>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 56 }, (_, i) => (
                <div
                  key={i}
                  className="bg-acc h-3 rounded-sm"
                  style={{ opacity: heatCell(pkg.fullName, i) }}
                />
              ))}
            </div>
            <div className="mt-2 font-mono text-[10px] text-white/20">last 56 weeks</div>
          </div>
        </div>
      </div>
    </div>
  )
}
