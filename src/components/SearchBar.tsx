import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { IconSearch } from './Icons'

type Props = {
  initial?: string
  autofocus?: boolean
  placeholder?: string
}

export const SearchBar = ({
  initial = '',
  autofocus = false,
  placeholder = 'Search packages, tags, authors…',
}: Props) => {
  const [value, setValue] = useState(initial)
  const ref = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!autofocus) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== ref.current) {
        e.preventDefault()
        ref.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [autofocus])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = value.trim()
    navigate({ to: '/packages', search: { q: q || undefined, sort: 'stars' } })
  }

  return (
    <form onSubmit={submit} className="group relative w-full">
      <IconSearch
        size={14}
        className="group-focus-within:text-acc absolute top-1/2 left-4 -translate-y-1/2 text-white/30 transition-colors"
      />
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search packages"
        className="bg-surf border-bd focus:border-acc focus:ring-acc rounded-pill w-full border py-3 pr-4 pl-10 font-mono text-[14px] text-white/80 transition-all outline-none placeholder:text-white/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute top-1/2 right-4 -translate-y-1/2 font-mono text-[11px] text-white/30 transition-colors hover:text-white/60"
        >
          clear
        </button>
      )}
    </form>
  )
}
