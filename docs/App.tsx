import { useEffect, useState } from 'react'
import {
  Badge,
  NimProvider,
  Segmented,
  ToastProvider,
  useNim,
  type NimDirection,
  type NimScheme,
  type NimTheme,
} from 'nim'
import { Components } from './sections/components'
import { Foundations } from './sections/foundations'

type Page = 'components' | 'foundations'

const NAV: Record<Page, { id: string; label: string }[]> = {
  foundations: [
    { id: 'color', label: 'Colour' },
    { id: 'type', label: 'Type' },
    { id: 'space', label: 'Space' },
    { id: 'shape', label: 'Shape & elevation' },
    { id: 'motion', label: 'Motion' },
  ],
  components: [
    { id: 'button', label: 'Button' },
    { id: 'badge', label: 'Badge' },
    { id: 'card', label: 'Card' },
    { id: 'stat', label: 'Stat' },
    { id: 'form', label: 'Form controls' },
    { id: 'list', label: 'List' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'sheet', label: 'Sheet' },
    { id: 'composition', label: 'Composition' },
  ],
}

/** The switches live inside the provider so they can drive it. */
function Controls({
  direction,
  onDirection,
  page,
  onPage,
}: {
  direction: NimDirection
  onDirection: (next: NimDirection) => void
  onPage: (next: Page) => void
  page: Page
}) {
  const { scheme, setScheme, setTheme, theme } = useNim()

  return (
    <div className="docs__bar">
      <Segmented
        label="Page"
        onChange={onPage}
        options={[
          { label: 'Foundations', value: 'foundations' },
          { label: 'Components', value: 'components' },
        ]}
        value={page}
      />
      <div className="docs__controls">
        <Segmented
          label="Theme"
          onChange={(next: NimTheme) => setTheme(next)}
          options={[
            { label: 'Ledger', value: 'ledger' },
            { label: 'Vlora', value: 'vlora' },
          ]}
          value={theme}
        />
        <Segmented
          label="Scheme"
          onChange={(next: NimScheme) => setScheme(next)}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          value={scheme}
        />
        <Segmented
          label="Direction"
          onChange={onDirection}
          options={[
            { label: 'LTR', value: 'ltr' },
            { label: 'RTL', value: 'rtl' },
          ]}
          value={direction}
        />
      </div>
    </div>
  )
}

export function App() {
  const [page, setPage] = useState<Page>('foundations')
  const [direction, setDirection] = useState<NimDirection>('ltr')
  const [active, setActive] = useState(NAV.foundations[0].id)

  // The sidebar follows the reader rather than the click: whichever section
  // owns the top of the viewport is the one marked current.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.docs__section'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [page])

  return (
    <NimProvider defaultScheme="light" defaultTheme="ledger" direction={direction}>
      <ToastProvider>
        <div className="docs">
          <aside className="docs__sidebar">
            <div className="docs__brand">
              <span className="docs__wordmark">nim</span>
              <Badge size="sm" tone="outline">
                v0.1
              </Badge>
            </div>
            <p className="docs__byline">
              Design system &amp; UI kit
              <br />
              designed and built by{' '}
              <a className="docs__byline-link" href="/">
                Nima Sarayan
              </a>
            </p>
            <nav className="docs__nav">
              {(Object.keys(NAV) as Page[]).map((key) => (
                <div key={key}>
                  <p className="nim-label docs__nav-group">{key}</p>
                  {NAV[key].map((item) => (
                    <a
                      aria-current={page === key && active === item.id ? 'true' : undefined}
                      className="docs__nav-link"
                      href={`#${item.id}`}
                      key={item.id}
                      onClick={() => setPage(key)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}
            </nav>
            <a className="docs__back" href="/">
              ← nim.zone
            </a>
          </aside>

          <main className="docs__main">
            <Controls direction={direction} onDirection={setDirection} onPage={setPage} page={page} />
            <div className="docs__page">{page === 'foundations' ? <Foundations /> : <Components />}</div>
          </main>
        </div>
      </ToastProvider>
    </NimProvider>
  )
}
