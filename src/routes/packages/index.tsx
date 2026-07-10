import { createFileRoute, Link } from '@tanstack/react-router'

import {
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconSliders,
  IconX,
} from '@/components/Icons'
import { PackageRow } from '@/components/PackageRow'
import { SearchBar } from '@/components/SearchBar'
import { getTagClass } from '@/lib/tags'
import type { PackageKind, SortKey } from '@/lib/types'
import { getPackages, getPopularTopics } from '@/server/packages'

type PackagesSearch = {
  q?: string
  kind?: PackageKind
  sort?: SortKey
  page?: number
}

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: 'stars', label: 'Most stars' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'created', label: 'Newest' },
  { value: 'name', label: 'Name A–Z' },
]

const CATEGORIES: Array<{ label: string; kind?: PackageKind }> = [
  { label: 'All packages', kind: undefined },
  { label: 'Libraries', kind: 'library' },
  { label: 'Bindings', kind: 'binding' },
  { label: 'Tools', kind: 'tool' },
  { label: 'Applications', kind: 'app' },
]

const KIND_LABELS: Record<PackageKind, string> = {
  library: 'libraries',
  binding: 'bindings',
  tool: 'tools',
  app: 'applications',
}

const PER_PAGE = 24

export const Route = createFileRoute('/packages/')({
  validateSearch: (search: Record<string, unknown>): PackagesSearch => {
    const sort = search.sort as SortKey
    const valid: Array<SortKey> = ['stars', 'updated', 'created', 'name']
    const kind = search.kind as PackageKind
    const validKinds: Array<PackageKind> = ['library', 'binding', 'tool', 'app']
    return {
      q: typeof search.q === 'string' && search.q ? search.q : undefined,
      kind: validKinds.includes(kind) ? kind : undefined,
      sort: valid.includes(sort) ? sort : undefined,
      page: Number(search.page) > 1 ? Number(search.page) : undefined,
    }
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    if (context.resolution.kind !== 'brand') {
      return { result: { items: [], total: 0, page: 1, perPage: PER_PAGE }, topics: [] }
    }
    const [result, topics] = await Promise.all([
      getPackages({
        data: {
          q: deps.q,
          kind: deps.kind,
          sort: deps.sort ?? 'stars',
          page: deps.page ?? 1,
          perPage: PER_PAGE,
        },
      }),
      getPopularTopics(),
    ])
    return { result, topics }
  },
  component: PackagesPage,
})

function PackagesPage() {
  const { result, topics } = Route.useLoaderData()
  const search = Route.useSearch()

  const page = search.page ?? 1
  const totalPages = Math.max(1, Math.ceil(result.total / PER_PAGE))
  const sort = search.sort ?? 'stars'
  const hasFilters = Boolean(search.q) || Boolean(search.kind)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 max-w-2xl">
        <SearchBar initial={search.q ?? ''} placeholder="Search packages…" autofocus />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* filters */}
        <div className="flex flex-col gap-4">
          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd flex items-center gap-2 border-b px-4 py-3">
              <IconSliders size={11} className="text-white/25" />
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Category
              </span>
            </div>
            <div className="py-1">
              {CATEGORIES.map((c) => {
                const active = (search.kind ?? undefined) === c.kind
                return (
                  <Link
                    key={c.label}
                    to="/packages"
                    search={{ q: search.q, kind: c.kind, sort }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-[12px] transition-colors ${
                      active ? 'text-acc' : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {c.label}
                    {active && <div className="bg-acc h-1 w-1 rounded-full" />}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd border-b px-4 py-3">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Sort by
              </span>
            </div>
            <div className="py-1">
              {SORTS.map((o) => {
                const active = sort === o.value
                return (
                  <Link
                    key={o.value}
                    to="/packages"
                    search={{ q: search.q, kind: search.kind, sort: o.value }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-[12px] transition-colors ${
                      active ? 'text-acc' : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    {o.label}
                    {active && <div className="bg-acc h-1 w-1 rounded-full" />}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="bg-card border-bd overflow-hidden rounded-lg border">
            <div className="border-bd border-b px-4 py-3">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                Topics
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-4 py-3">
              {topics.map((t) => {
                const active = search.q === t.topic
                return (
                  <Link
                    key={t.topic}
                    to="/packages"
                    search={{ q: active ? undefined : t.topic, kind: search.kind, sort }}
                    className={`rounded-lg border px-2 py-1 font-mono text-[10px] transition-all ${getTagClass(t.topic)}`}
                    style={active ? { outline: '1px solid var(--acc)', outlineOffset: 1 } : {}}
                  >
                    {t.topic}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* results */}
        <div className="lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div className="font-mono text-[13px] text-white/40">
              <span className="font-semibold text-white/70">{result.total.toLocaleString()}</span>{' '}
              {search.kind ? KIND_LABELS[search.kind] : 'packages'}
              {search.q && (
                <>
                  {' '}
                  matching <span className="text-acc">&quot;{search.q}&quot;</span>
                </>
              )}
            </div>
            {hasFilters && (
              <Link
                to="/packages"
                search={{ sort }}
                className="flex items-center gap-1 font-mono text-[11px] text-white/25 transition-colors hover:text-white/50"
              >
                <IconX size={10} />
                clear filters
              </Link>
            )}
          </div>

          {result.items.length === 0 ? (
            <div className="bg-card border-bd flex flex-col items-center justify-center rounded-lg border py-32 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                <IconSearch size={18} className="text-white/20" />
              </div>
              <div className="mb-1 font-mono text-sm text-white/30">No packages found</div>
              <div className="font-mono text-[12px] text-white/20">
                Try adjusting your search or filters
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {result.items.map((pkg) => (
                <PackageRow key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <PageLink
                to={Math.max(1, page - 1)}
                disabled={page <= 1}
                q={search.q}
                kind={search.kind}
                sort={sort}
              >
                <IconChevronLeft size={14} />
              </PageLink>
              <span className="px-3 font-mono text-[12px] text-white/35">
                {page} / {totalPages}
              </span>
              <PageLink
                to={Math.min(totalPages, page + 1)}
                disabled={page >= totalPages}
                q={search.q}
                kind={search.kind}
                sort={sort}
              >
                <IconChevronRight size={14} />
              </PageLink>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type PageLinkProps = {
  to: number
  disabled: boolean
  q?: string
  kind?: PackageKind
  sort: SortKey
  children: React.ReactNode
}

const PageLink = ({ to, disabled, q, kind, sort, children }: PageLinkProps) => (
  <Link
    to="/packages"
    search={{ q, kind, sort, page: to > 1 ? to : undefined }}
    aria-disabled={disabled}
    className="border-bd bg-card flex size-8 items-center justify-center rounded-lg border text-white/35 transition-colors hover:border-white/15 hover:text-white/70 aria-disabled:pointer-events-none aria-disabled:opacity-40"
  >
    {children}
  </Link>
)
