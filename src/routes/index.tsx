import { createFileRoute, Link } from '@tanstack/react-router'

import { IconChevronRight, IconPackage, IconStar, IconTag, IconUsers } from '@/components/Icons'
import { PackageCard } from '@/components/PackageCard'
import { SearchBar } from '@/components/SearchBar'
import { formatNumber, formatRelativeDate } from '@/lib/format'
import { getTagClass } from '@/lib/tags'
import type { Package } from '@/lib/types'
import { useBrand } from '@/lib/useBrand'
import { getPackages, getPopularTopics, getStats } from '@/server/packages'

type HomeSearch = {
  view?: 'recent'
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    view: search.view === 'recent' ? 'recent' : undefined,
  }),
  loader: async ({ context }) => {
    if (context.resolution.kind !== 'brand') {
      return {
        stats: { totalPackages: 0, totalStars: 0, topContributors: 0 },
        popular: [],
        updated: [],
        newest: [],
        topics: [],
      }
    }
    const [stats, popular, updated, newest, topics] = await Promise.all([
      getStats(),
      getPackages({ data: { sort: 'stars', perPage: 12 } }),
      getPackages({ data: { sort: 'updated', perPage: 12 } }),
      getPackages({ data: { sort: 'created', perPage: 6 } }),
      getPopularTopics(),
    ])
    return { stats, popular: popular.items, updated: updated.items, newest: newest.items, topics }
  },
  component: Home,
})

function Home() {
  const { stats, popular, updated, newest, topics } = Route.useLoaderData()
  const search = Route.useSearch()
  const brand = useBrand()

  const view = search.view ?? 'popular'
  const list = view === 'popular' ? popular : updated

  const statCells = [
    {
      label: 'packages',
      value: formatNumber(stats.totalPackages),
      icon: <IconPackage size={16} className="text-acc" />,
    },
    {
      label: 'total stars',
      value: formatNumber(stats.totalStars),
      icon: <IconStar size={16} className="text-acc" />,
    },
    {
      label: 'authors',
      value: formatNumber(stats.topContributors),
      icon: <IconUsers size={16} className="text-acc" />,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* hero */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex items-center gap-2">
          <div
            className="bg-accbrand h-1.5 w-1.5 rounded-full"
            style={{ animation: 'pulse 2.4s infinite' }}
          />
          <span className="text-accbrand font-mono text-[11px] tracking-widest uppercase">
            {brand.language} Package Registry
          </span>
        </div>
        <h1 className="mb-4 text-4xl leading-none font-bold tracking-[-0.03em] text-white/90 sm:text-5xl">
          Find your next
          <br />
          <span className="text-accbrand">{brand.language} dependency.</span>
        </h1>
        <div className="mt-8 flex items-center gap-8">
          {statCells.map((s) => (
            <div key={s.label} className="flex items-center gap-2.5">
              {s.icon}
              <div className="flex flex-col items-start">
                <span className="font-mono text-xl leading-none font-bold text-white/90 tabular-nums">
                  {s.value}
                </span>
                <span className="font-mono text-[11px] text-white/30">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* search */}
      <div className="mb-8 flex justify-center">
        <div className="w-full max-w-xl">
          <SearchBar autofocus />
        </div>
      </div>

      {/* tag pills */}
      <div className="mt-6 mb-10 flex flex-wrap justify-center gap-2">
        <Link
          to="/packages"
          search={{ sort: 'stars' }}
          className="bg-acc border-acc text-btx rounded-lg border px-3 py-1.5 font-mono text-[11px] font-semibold transition-all"
        >
          all packages
        </Link>
        {brand.topics.map((t) => (
          <Link
            key={t}
            to="/packages"
            search={{ q: t, sort: 'stars' }}
            className="border-bd rounded-lg border px-3 py-1.5 font-mono text-[11px] text-white/35 transition-all hover:border-white/20 hover:text-white/70"
          >
            <span className="flex items-center gap-1">
              <IconTag size={8} />
              {t}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* packages */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-surf2 flex items-center gap-1 rounded-lg p-1">
              {(['popular', 'recent'] as const).map((tab) => (
                <Link
                  key={tab}
                  to="/"
                  search={tab === 'recent' ? { view: tab } : {}}
                  replace
                  resetScroll={false}
                  className={`rounded-lg px-4 py-1.5 font-mono text-[12px] transition-all ${
                    view === tab ? 'bg-card text-white/90' : 'text-white/30 hover:text-white/60'
                  }`}
                >
                  {tab}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {list.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>

        {/* sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd flex items-center justify-between border-b px-5 py-3.5">
              <span className="font-mono text-[12px] font-semibold tracking-wider text-white/60 uppercase">
                Recently Added
              </span>
              <span className="font-mono text-[10px] text-white/25">{newest.length} new</span>
            </div>
            {newest.map((pkg) => (
              <RecentItem key={pkg.id} pkg={pkg} />
            ))}
            <div className="border-bd border-t px-5 py-3">
              <Link
                to="/packages"
                search={{ sort: 'created' }}
                className="flex items-center gap-1 font-mono text-[11px] text-white/25 transition-colors hover:text-white/60"
              >
                View all recent <IconChevronRight size={10} />
              </Link>
            </div>
          </div>

          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd border-b px-5 py-3.5">
              <span className="font-mono text-[12px] font-semibold tracking-wider text-white/60 uppercase">
                Popular Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-2 px-5 py-4">
              {topics.map((t) => (
                <Link
                  key={t.topic}
                  to="/packages"
                  search={{ q: t.topic, sort: 'stars' }}
                  className={`rounded-lg border px-2 py-1 font-mono text-[10px] transition-all ${getTagClass(t.topic)}`}
                >
                  {t.topic}
                  {t.count > 0 && <span className="opacity-50"> ({t.count})</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RecentItem = ({ pkg }: { pkg: Package }) => (
  <Link
    to="/packages/$owner/$repo"
    params={{ owner: pkg.owner, repo: pkg.name }}
    className="group border-bd flex cursor-pointer items-start gap-3 border-b px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.07]"
  >
    <div className="min-w-0 flex-1">
      <div className="truncate font-mono text-[13px] font-medium text-white/60 transition-colors group-hover:text-white">
        {pkg.name}
      </div>
      <div className="mt-0.5 truncate text-[11px] text-white/25 transition-colors group-hover:text-white/40">
        {pkg.description || 'No description'}
      </div>
    </div>
    <div className="flex shrink-0 flex-col items-end gap-1">
      <span className="font-mono text-[10px] text-white/20">
        {formatRelativeDate(pkg.createdAt)}
      </span>
      <span className="flex items-center gap-0.5 font-mono text-[10px] text-white/25">
        <IconStar size={8} />
        {formatNumber(pkg.stars)}
      </span>
    </div>
  </Link>
)
