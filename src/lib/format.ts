export const formatNumber = (n: number): string => {
  if (n < 1000) return String(n)
  if (n < 1_000_000) {
    const v = n / 1000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1).replace(/\.0$/, '')}K`
  }
  const v = n / 1_000_000
  return `${v.toFixed(1).replace(/\.0$/, '')}M`
}

export const formatVersion = (version: string | null): string | null => {
  if (!version) return null
  const v = version.replace(/^v/i, '')
  return /^\d/.test(v) ? `v${v}` : v.slice(0, 10)
}

export const formatRelativeDate = (iso: string): string => {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)

  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < hour) {
    const m = Math.round(diff / minute)
    return m <= 1 ? 'just now' : `${m} minutes ago`
  }
  if (diff < day) {
    const h = Math.round(diff / hour)
    return `${h} hour${h === 1 ? '' : 's'} ago`
  }
  if (diff < week) {
    const d = Math.round(diff / day)
    return `${d} day${d === 1 ? '' : 's'} ago`
  }
  if (diff < month) {
    const w = Math.round(diff / week)
    return `${w} week${w === 1 ? '' : 's'} ago`
  }
  if (diff < year) {
    const mo = Math.round(diff / month)
    return `${mo} month${mo === 1 ? '' : 's'} ago`
  }
  const y = Math.round(diff / year)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
