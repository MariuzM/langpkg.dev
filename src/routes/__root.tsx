import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts, useRouteContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LanguageSelect } from '@/components/LanguageSelect'
import { LegacyNotice } from '@/components/LegacyNotice'
import { NotFound } from '@/components/NotFound'
import { getHostResolution } from '@/lib/brand-resolver'
import { DEFAULT_BRAND_ID, getBrand } from '@/lib/brands'

import appCss from '../styles/styles.css?url'

export const Route = createRootRoute({
  beforeLoad: () => {
    const resolution = getHostResolution()
    const brandId = resolution.kind === 'landing' ? DEFAULT_BRAND_ID : resolution.brandId
    return { resolution, brand: getBrand(brandId) }
  },
  head: ({ match }) => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title:
          match.context.resolution.kind === 'landing'
            ? 'langpkg.dev — package registries for Jai & Odin'
            : `${match.context.brand.host} — ${match.context.brand.language} package registry`,
      },
      {
        name: 'description',
        content: `Find your next ${match.context.brand.language} dependency. Curated ${match.context.brand.language} libraries, bindings, and tools with activity, versions, and health at a glance.`,
      },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { brand, resolution } = useRouteContext({ from: '__root__' })
  const content =
    resolution.kind === 'landing' ? (
      <LanguageSelect />
    ) : resolution.kind === 'legacy' ? (
      <LegacyNotice brand={brand} />
    ) : (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    )

  return (
    <html lang="en" data-brand={resolution.kind === 'landing' ? 'langpkg' : brand.id}>
      <head>
        <HeadContent />
      </head>
      <body>
        {content}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
