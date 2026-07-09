export type BrandId = 'jai' | 'odin'

export type Brand = {
  id: BrandId
  wordmark: string
  letter: string
  host: string
  legacyHost: string
  tagline: string
  heroLine: string
  language: string
  repo: string
  topics: Array<string>
  searchQualifier: string
  discoveryQueries: Array<string>
}

export type HostResolution =
  { kind: 'brand'; brandId: BrandId } | { kind: 'legacy'; brandId: BrandId } | { kind: 'landing' }

export const LANDING_HOST = 'langpkg.dev'

export const BRANDS: Record<BrandId, Brand> = {
  jai: {
    id: 'jai',
    wordmark: 'jai',
    letter: 'j',
    host: 'jai.langpkg.dev',
    legacyHost: 'jaipkg.dev',
    tagline: 'Jai package discovery',
    heroLine: 'Jai dependency',
    language: 'Jai',
    repo: 'MariuzM/langpkg.dev',
    topics: ['gamedev', 'bindings', 'graphics', 'simd', 'cli', 'http'],
    searchQualifier: 'language:Jai fork:false',
    discoveryQueries: [
      'language:Jai fork:false',
      'topic:jai fork:false',
      'topic:jai-lang fork:false',
      'topic:jai-programming-language fork:false',
      'topic:jai-module fork:false',
      'topic:jai-library fork:false',
      'topic:jai-beta-users fork:false',
    ],
  },
  odin: {
    id: 'odin',
    wordmark: 'odin',
    letter: 'o',
    host: 'odin.langpkg.dev',
    legacyHost: 'odinpkg.dev',
    tagline: 'Odin package discovery',
    heroLine: 'Odin dependency',
    language: 'Odin',
    repo: 'MariuzM/odinpkg',
    topics: ['gamedev', 'bindings', 'graphics', 'vendor', 'cli', 'http'],
    searchQualifier: 'language:Odin fork:false',
    discoveryQueries: [
      'language:Odin fork:false',
      'topic:odin-lang fork:false',
      'topic:odinlang fork:false',
      'topic:odin-programming-language fork:false',
      'topic:odin-package fork:false',
    ],
  },
}

export const DEFAULT_BRAND_ID: BrandId = 'jai'

export const isBrandId = (v: string | null | undefined): v is BrandId =>
  v != null && Object.prototype.hasOwnProperty.call(BRANDS, v)

export const getBrand = (id: BrandId): Brand => BRANDS[id]

const normalizeHost = (host: string): string =>
  host
    .toLowerCase()
    .split(':')[0]
    .replace(/^www\./, '')

export const resolveHost = (host: string | null | undefined): HostResolution => {
  if (!host) return { kind: 'landing' }
  const h = normalizeHost(host)
  const labels = h.split('.')

  const legacy = Object.values(BRANDS).find(
    (b) => h === b.legacyHost || h.endsWith(`.${b.legacyHost}`),
  )
  if (legacy) return { kind: 'legacy', brandId: legacy.id }

  const branded = Object.values(BRANDS).find(
    (b) => h === b.host || h.endsWith(`.${b.host}`) || labels.includes(b.id),
  )
  if (branded) return { kind: 'brand', brandId: branded.id }

  return { kind: 'landing' }
}

export const envBrandId = (): BrandId | null => {
  const v = import.meta.env.VITE_BRAND
  return isBrandId(v) ? v : null
}
