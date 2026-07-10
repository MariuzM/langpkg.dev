import type { SVGProps } from 'react'

type IconProps = {
  size?: number
} & SVGProps<SVGSVGElement>

const stroke = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

const fill = (size: number, props: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  ...props,
})

export const IconSearch = ({ size = 17, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const IconGithub = ({ size = 15, ...props }: IconProps) => (
  <svg {...fill(size, props)} aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

export const IconStar = ({ size = 12, ...props }: IconProps) => (
  <svg {...fill(size, props)}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
  </svg>
)

export const IconClock = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

export const IconExternalLink = ({ size = 13, ...props }: IconProps) => (
  <svg {...stroke(size, props)} strokeWidth={2.2}>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
  </svg>
)

export const IconCheck = ({ size = 11, ...props }: IconProps) => (
  <svg {...stroke(size, props)} strokeWidth={3}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const IconCheckCircle = ({ size = 11, ...props }: IconProps) => (
  <svg {...stroke(size, props)} strokeWidth={2.4}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
)

export const IconList = ({ size = 15, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
)

export const IconGrid = ({ size = 15, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

export const IconChevronLeft = ({ size = 16, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const IconChevronRight = ({ size = 16, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const IconArrowRight = ({ size = 15, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconArchive = ({ size = 13, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <rect x="2" y="4" width="20" height="5" rx="1" />
    <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M10 13h4" />
  </svg>
)

export const IconArrowLeft = ({ size = 11, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
)

export const IconPackage = ({ size = 13, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </svg>
)

export const IconUsers = ({ size = 16, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13A4 4 0 0 1 16 11" />
  </svg>
)

export const IconGitFork = ({ size = 10, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <circle cx="12" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="6" r="3" />
    <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9M12 12v3" />
  </svg>
)

export const IconRefresh = ({ size = 8, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
)

export const IconZap = ({ size = 9, ...props }: IconProps) => (
  <svg {...fill(size, props)} stroke="currentColor" strokeWidth={1}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

export const IconTag = ({ size = 8, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </svg>
)

export const IconScale = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
)

export const IconBookOpen = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

export const IconGitBranch = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M6 3v12" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
)

export const IconShieldCheck = ({ size = 28, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const IconActivity = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
  </svg>
)

export const IconHash = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
)

export const IconCalendar = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M8 2v4M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

export const IconSliders = ({ size = 11, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
  </svg>
)

export const IconX = ({ size = 12, ...props }: IconProps) => (
  <svg {...stroke(size, props)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
