import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { IconSearch } from './Icons'

type Props = {
  initial?: string
  autofocus?: boolean
}

export const SearchBar = ({ initial = '', autofocus = false }: Props) => {
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
    <form
      onSubmit={submit}
      className="shadow-card border-chipbd bg-surf focus-within:border-acc flex items-center gap-2.75 rounded-[13px] border py-1.5 pr-1.5 pl-4 transition-colors"
    >
      <IconSearch size={17} className="text-fai" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search packages — try raylib"
        aria-label="Search packages"
        className="text-tx placeholder:text-fai min-w-0 flex-1 bg-transparent font-sans text-[15px] outline-none"
      />
      <button
        type="submit"
        className="bg-acc text-btx rounded-[9px] px-4.5 py-2.25 font-sans text-[13.5px] font-semibold transition-opacity hover:opacity-90"
      >
        Search
      </button>
    </form>
  )
}
