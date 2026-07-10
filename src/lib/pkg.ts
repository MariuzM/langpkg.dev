import type { Package, PackageKind } from './types'

export const deriveKind = (pkg: Pick<Package, 'name' | 'description' | 'topics'>): PackageKind => {
  const hay = `${pkg.name} ${pkg.description ?? ''} ${pkg.topics.join(' ')}`.toLowerCase()
  if (/(binding|bindings|wrapper|ffi|-sys\b)/.test(hay)) return 'binding'
  if (/(\bcli\b|tool|tooling|compiler|linter|formatter|language-server|lsp)/.test(hay))
    return 'tool'
  if (/(\bapp\b|application|game|editor|engine|demo)/.test(hay)) return 'app'
  return 'library'
}

export const ownerInitial = (owner: string): string => owner.charAt(0).toLowerCase() || '?'

export const isMaintained = (iso: string): boolean =>
  Date.now() - new Date(iso).getTime() < 1000 * 60 * 60 * 24 * 180

export const isTrending = (pkg: Pick<Package, 'stars' | 'pushedAt'>): boolean =>
  pkg.stars >= 100 && Date.now() - new Date(pkg.pushedAt).getTime() < 1000 * 60 * 60 * 24 * 45
