import { ulid } from 'ulid'

import type { Brand } from '@/lib/brands'
import { deriveKind } from '@/lib/pkg'
import type { Package, PackageQuery, Release } from '@/lib/types'

const GITHUB_API = 'https://api.github.com'

type CacheEntry = { at: number; value: unknown }
const cache = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()

export type GhError = Error & {
  status: number
  rateLimited?: boolean
  resetAt?: number
}

export const GITHUB_SEARCH_LIMIT = 1000

const baseHeaders = (): Record<string, string> => {
  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'pkg-registry',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function ghFetch<T>(path: string, ttlMs: number, accept?: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${GITHUB_API}${path}`
  const key = `${accept ?? 'json'}:${url}`

  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as T

  const existing = inflight.get(key)
  if (existing) return existing as Promise<T>

  const headers = baseHeaders()
  if (accept) headers.Accept = accept

  const promise = (async () => {
    const res = await fetch(url, { headers })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      const err = new Error(
        res.status === 404 ? 'not-found' : `GitHub ${res.status}: ${body.slice(0, 200)}`,
      ) as GhError
      err.status = res.status
      const reset = res.headers.get('x-ratelimit-reset')
      const retryAfter = res.headers.get('retry-after')
      if (retryAfter) err.resetAt = Date.now() + Number(retryAfter) * 1000
      else if (reset) err.resetAt = Number(reset) * 1000
      err.rateLimited =
        res.status === 429 ||
        (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0')
      throw err
    }
    const value = (accept?.includes('html') ? await res.text() : await res.json()) as T
    cache.set(key, { at: Date.now(), value })
    return value
  })()

  inflight.set(key, promise)
  try {
    return await promise
  } finally {
    inflight.delete(key)
  }
}

export type GhRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  watchers_count: number
  license: { spdx_id: string | null } | null
  topics?: Array<string>
  language: string | null
  pushed_at: string
  created_at: string
  updated_at: string
  archived: boolean
  default_branch: string
  owner: { login: string; avatar_url: string }
}

export const mapRepo = (r: GhRepo): Package => {
  const name = r.name
  const description = r.description
  const topics = r.topics ?? []
  return {
    id: ulid(),
    githubId: r.id,
    version: null,
    name,
    owner: r.owner.login,
    fullName: r.full_name,
    description,
    url: r.html_url,
    homepage: r.homepage && r.homepage.trim() ? r.homepage : null,
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    watchers: r.watchers_count,
    license: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null,
    topics,
    language: r.language,
    kind: deriveKind({ name, description, topics }),
    pushedAt: r.pushed_at,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    ownerAvatar: r.owner.avatar_url,
    archived: r.archived,
    defaultBranch: r.default_branch,
  }
}

const sortParam = (sort: PackageQuery['sort']) => {
  switch (sort) {
    case 'updated':
      return { sort: 'updated', order: 'desc', extra: '' }
    case 'created':
      return { sort: '', order: 'desc', extra: 'sort:created-desc' }
    case 'name':
      return { sort: '', order: 'asc', extra: 'sort:name-asc' }
    default:
      return { sort: 'stars', order: 'desc', extra: '' }
  }
}

export const searchReposPage = async (
  rawQuery: string,
  opts: {
    sort?: PackageQuery['sort']
    page?: number
    perPage?: number
    ttlMs?: number
  } = {},
): Promise<{ items: Array<Package>; total: number }> => {
  const page = Math.max(1, opts.page ?? 1)
  const perPage = Math.min(100, opts.perPage ?? 24)

  const parts = [rawQuery.trim()]
  const s = sortParam(opts.sort)
  if (s.extra) parts.push(s.extra)

  const params = new URLSearchParams({
    q: parts.join(' '),
    per_page: String(perPage),
    page: String(page),
  })
  if (s.sort) params.set('sort', s.sort)
  if (s.order) params.set('order', s.order)

  const res = await ghFetch<{ total_count: number; items: Array<GhRepo> }>(
    `/search/repositories?${params.toString()}`,
    opts.ttlMs ?? 5 * 60_000,
  )
  return {
    items: res.items.map(mapRepo),
    total: Math.min(res.total_count, GITHUB_SEARCH_LIMIT),
  }
}

export const searchCount = async (query: string): Promise<number> => {
  const params = new URLSearchParams({ q: query.trim(), per_page: '1' })
  const res = await ghFetch<{ total_count: number }>(
    `/search/repositories?${params.toString()}`,
    0,
  )
  return res.total_count
}

export const searchRepos = async (
  brand: Brand,
  query: PackageQuery,
): Promise<{ items: Array<Package>; total: number }> => {
  const term = (query.q ?? '').trim()
  const q = term ? `${brand.searchQualifier} ${term}` : brand.searchQualifier
  return searchReposPage(q, {
    sort: query.sort,
    page: query.page,
    perPage: query.perPage,
  })
}

export const fetchRepoCore = async (owner: string, repo: string): Promise<Package> => {
  const data = await ghFetch<GhRepo>(`/repos/${owner}/${repo}`, 5 * 60_000)
  return mapRepo(data)
}

type GhTag = { name: string }
type GhCommit = { sha: string }

export const fetchLatestVersion = async (owner: string, repo: string): Promise<string | null> => {
  const tags = await ghFetch<Array<GhTag>>(
    `/repos/${owner}/${repo}/tags?per_page=1`,
    30 * 60_000,
  ).catch(() => [] as Array<GhTag>)
  if (tags[0]?.name) return tags[0].name

  const commits = await ghFetch<Array<GhCommit>>(
    `/repos/${owner}/${repo}/commits?per_page=1`,
    30 * 60_000,
  ).catch(() => [] as Array<GhCommit>)
  const sha = commits[0]?.sha
  return sha ? sha.slice(0, 7) : null
}

type GhRelease = {
  name: string | null
  tag_name: string
  html_url: string
  published_at: string | null
  prerelease: boolean
}

export const fetchReadmeAndReleases = async (
  owner: string,
  repo: string,
  branch: string,
): Promise<{ readmeHtml: string | null; releases: Array<Release> }> => {
  const [readmeHtml, rawReleases] = await Promise.all([
    ghFetch<string>(
      `/repos/${owner}/${repo}/readme`,
      10 * 60_000,
      'application/vnd.github.html+json',
    ).catch(() => null),
    ghFetch<Array<GhRelease>>(`/repos/${owner}/${repo}/releases?per_page=15`, 10 * 60_000).catch(
      () => [] as Array<GhRelease>,
    ),
  ])

  const releases: Array<Release> = rawReleases.map((rel) => ({
    name: rel.name || rel.tag_name,
    tag: rel.tag_name,
    url: rel.html_url,
    publishedAt: rel.published_at,
    prerelease: rel.prerelease,
  }))

  return {
    readmeHtml: readmeHtml ? rewriteReadme(readmeHtml, owner, repo, branch) : null,
    releases,
  }
}

export const rewriteReadme = (
  html: string,
  owner: string,
  repo: string,
  branch: string,
): string => {
  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`
  const blobBase = `https://github.com/${owner}/${repo}/blob/${branch}/`
  return html
    .replace(/(<img[^>]+src=")(?!https?:|data:)([^"]+)"/gi, `$1${rawBase}$2"`)
    .replace(/(<a[^>]+href=")(?!https?:|#|mailto:)([^"]+)"/gi, `$1${blobBase}$2"`)
}
