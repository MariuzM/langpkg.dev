import { and, asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { createServerFn } from '@tanstack/react-start'

import { getDb } from '@/db'
import type { PackageRow } from '@/db/schema'
import { packages } from '@/db/schema'
import { getBrandId } from '@/lib/brand-resolver'
import type { Brand } from '@/lib/brands'
import { getBrand } from '@/lib/brands'
import type {
  Package,
  PackageDetail,
  PackageListResult,
  PackageQuery,
  SortKey,
  Stats,
} from '@/lib/types'

import {
  fetchLatestVersion,
  fetchReadmeAndReleases,
  fetchRepoCore,
  searchRepos,
} from './github-source'

const columns = {
  id: packages.id,
  githubId: packages.githubId,
  name: packages.name,
  owner: packages.owner,
  fullName: packages.fullName,
  description: packages.description,
  version: packages.version,
  url: packages.url,
  homepage: packages.homepage,
  stars: packages.stars,
  forks: packages.forks,
  openIssues: packages.openIssues,
  watchers: packages.watchers,
  license: packages.license,
  topics: packages.topics,
  language: packages.language,
  kind: packages.kind,
  pushedAt: packages.pushedAt,
  repoCreatedAt: packages.repoCreatedAt,
  repoUpdatedAt: packages.repoUpdatedAt,
  ownerAvatar: packages.ownerAvatar,
  archived: packages.archived,
  defaultBranch: packages.defaultBranch,
}

type PackageColumns = {
  [K in keyof typeof columns]: PackageRow[K]
}

const rowToPackage = (r: PackageColumns): Package => ({
  id: r.id,
  githubId: r.githubId,
  name: r.name,
  owner: r.owner,
  fullName: r.fullName,
  description: r.description,
  version: r.version,
  url: r.url,
  homepage: r.homepage,
  stars: r.stars,
  forks: r.forks,
  openIssues: r.openIssues,
  watchers: r.watchers,
  license: r.license,
  topics: r.topics,
  language: r.language,
  kind: r.kind as Package['kind'],
  pushedAt: r.pushedAt.toISOString(),
  createdAt: r.repoCreatedAt.toISOString(),
  updatedAt: r.repoUpdatedAt.toISOString(),
  ownerAvatar: r.ownerAvatar,
  archived: r.archived,
  defaultBranch: r.defaultBranch,
})

const orderFor = (sort: SortKey | undefined) => {
  switch (sort) {
    case 'updated':
      return desc(packages.pushedAt)
    case 'created':
      return desc(packages.repoCreatedAt)
    case 'name':
      return asc(packages.name)
    default:
      return desc(packages.stars)
  }
}

const hasRows = async (db: NonNullable<ReturnType<typeof getDb>>, brand: Brand) => {
  const [row] = await db
    .select({ value: count() })
    .from(packages)
    .where(eq(packages.ecosystem, brand.id))
    .limit(1)
  return row.value > 0
}

export const getPackages = createServerFn({ method: 'GET' })
  .validator((d: PackageQuery) => d)
  .handler(async ({ data }): Promise<PackageListResult> => {
    const page = Math.max(1, data.page ?? 1)
    const perPage = Math.min(50, data.perPage ?? 24)
    const term = (data.q ?? '').trim()
    const brand = getBrand(getBrandId())
    const db = getDb()

    if (db && (await hasRows(db, brand))) {
      const filters = [
        eq(packages.ecosystem, brand.id),
        term
          ? or(
              ilike(packages.name, `%${term}%`),
              ilike(packages.description, `%${term}%`),
              ilike(packages.owner, `%${term}%`),
            )
          : undefined,
        data.kind ? eq(packages.kind, data.kind) : undefined,
      ].filter(Boolean)
      const where = filters.length ? and(...filters) : undefined

      const [items, [totalRow]] = await Promise.all([
        db
          .select(columns)
          .from(packages)
          .where(where)
          .orderBy(orderFor(data.sort))
          .limit(perPage)
          .offset((page - 1) * perPage),
        db.select({ value: count() }).from(packages).where(where),
      ])

      return {
        items: items.map(rowToPackage),
        total: totalRow.value,
        page,
        perPage,
      }
    }

    const res = await searchRepos(brand, { ...data, page, perPage })
    return { items: res.items, total: res.total, page, perPage }
  })

export const getStats = createServerFn({ method: 'GET' }).handler(async (): Promise<Stats> => {
  const brand = getBrand(getBrandId())
  const db = getDb()
  if (db && (await hasRows(db, brand))) {
    const [row] = await db
      .select({
        total: count(),
        stars: sql<number>`coalesce(sum(${packages.stars}), 0)`,
        authors: sql<number>`count(distinct ${packages.owner})`,
      })
      .from(packages)
      .where(eq(packages.ecosystem, brand.id))
    return {
      totalPackages: Number(row.total),
      totalStars: Number(row.stars),
      topContributors: Number(row.authors),
    }
  }

  const res = await searchRepos(brand, { sort: 'stars', perPage: 100 })
  return {
    totalPackages: res.total,
    totalStars: res.items.reduce((sum, p) => sum + p.stars, 0),
    topContributors: new Set(res.items.map((p) => p.owner)).size,
  }
})

export type LandingStats = Partial<Record<string, { packages: number; stars: number }>>

export const getLandingStats = createServerFn({ method: 'GET' }).handler(
  async (): Promise<LandingStats> => {
    const db = getDb()
    if (!db) return {}
    const rows = await db
      .select({
        ecosystem: packages.ecosystem,
        total: count(),
        stars: sql<number>`coalesce(sum(${packages.stars}), 0)`,
      })
      .from(packages)
      .groupBy(packages.ecosystem)
    return Object.fromEntries(
      rows.map((r) => [r.ecosystem, { packages: Number(r.total), stars: Number(r.stars) }]),
    )
  },
)

export type TopicCount = { topic: string; count: number }

export const getPopularTopics = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<TopicCount>> => {
    const brand = getBrand(getBrandId())
    const db = getDb()
    if (!db || !(await hasRows(db, brand))) {
      return brand.topics.map((topic) => ({ topic, count: 0 }))
    }
    const rows = await db.execute<{ topic: string; count: number }>(sql`
      select t.topic as topic, count(*)::int as count
      from ${packages}, jsonb_array_elements_text(${packages.topics}) as t(topic)
      where ${packages.ecosystem} = ${brand.id}
      group by t.topic
      order by count desc, t.topic asc
      limit 12
    `)
    return Array.from(rows).map((r) => ({ topic: r.topic, count: Number(r.count) }))
  },
)

export const getPackage = createServerFn({ method: 'GET' })
  .validator((d: { owner: string; repo: string }) => d)
  .handler(async ({ data }): Promise<PackageDetail> => {
    const { owner, repo } = data
    const brand = getBrand(getBrandId())
    const db = getDb()

    let base: Package
    if (db) {
      const rows = await db
        .select(columns)
        .from(packages)
        .where(
          and(
            eq(packages.ecosystem, brand.id),
            ilike(packages.owner, owner),
            ilike(packages.name, repo),
          ),
        )
        .limit(1)
      base = rows.length ? rowToPackage(rows[0]) : await fetchRepoCore(owner, repo)
    } else {
      base = await fetchRepoCore(owner, repo)
    }

    const { readmeHtml, releases } = await fetchReadmeAndReleases(
      base.owner,
      base.name,
      base.defaultBranch,
    )

    const releaseVersion = releases.find((r) => !r.prerelease)?.tag ?? releases.at(0)?.tag ?? null
    const version =
      base.version ?? releaseVersion ?? (await fetchLatestVersion(base.owner, base.name))

    return {
      ...base,
      version,
      readmeHtml,
      releases,
      contributors: null,
    }
  })
