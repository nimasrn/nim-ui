import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  NimProvider,
  Segmented,
  ToastProvider,
  useNim,
  type NimColorway,
  type NimScheme,
  type NimStyle,
} from 'nim'
import { COPY, type Lang } from './copy'
import { Components } from './sections/components'
import { Flows } from './sections/flows'
import { Foundations } from './sections/foundations'

type Page = 'components' | 'flows' | 'foundations'

const NAV: Record<Page, (keyof (typeof COPY)['en']['nav'])[]> = {
  foundations: ['color', 'type', 'space', 'shape', 'focus', 'density', 'motion'],
  components: [
    'button', 'badge', 'card', 'stat', 'form', 'list', 'feedback', 'sheet',
    'navigation', 'overlay', 'data', 'input', 'composition', 'chart', 'map', 'player',
  ],
  flows: [
    'onboarding', 'auth', 'wizard', 'messenger', 'chat', 'assistant', 'checkout',
    'progress', 'plans', 'profile', 'tabbar', 'admin', 'console',
  ],
}

const PAGES: Page[] = ['foundations', 'components', 'flows']

const COLORWAYS: NimColorway[] = ['vermilion', 'oxblood', 'signal', 'coral', 'teal', 'sable', 'malachite']

const COLORWAY_LABEL: Record<NimColorway, string> = {
  coral: 'Coral',
  oxblood: 'Oxblood',
  sable: 'Sable',
  teal: 'Teal',
  signal: 'Signal',
  vermilion: 'Vermilion',
  malachite: 'Malachite',
}

/**
 * The colourway picker is one swatch per colourway rather than a list of words: each dot is
 * painted by the colourway it selects, so the control shows the choice instead
 * of naming it — and the whole appearance cluster then fits on one line.
 */
function ColorwayPicker({ label }: { label: string }) {
  const { colorway, setColorway } = useNim()
  return (
    <div aria-label={label} className="docs__ways" role="radiogroup">
      {COLORWAYS.map((value) => (
        <button
          aria-checked={value === colorway}
          aria-label={COLORWAY_LABEL[value]}
          className="docs__way"
          data-nim-colorway={value}
          key={value}
          onClick={() => setColorway(value)}
          role="radio"
          title={COLORWAY_LABEL[value]}
          type="button"
        >
          <span className="docs__way-dot" />
        </button>
      ))}
    </div>
  )
}

/** The switches live inside the provider so they can drive it. */
function Controls({
  lang,
  onLang,
  page,
  onPage,
}: {
  lang: Lang
  onLang: (next: Lang) => void
  onPage: (next: Page) => void
  page: Page
}) {
  const { scheme, setScheme, setStyle, style } = useNim()
  const c = COPY[lang]

  return (
    <header className="docs__bar">
      <Segmented
        className="docs__pages"
        label={c.controls.page}
        onChange={onPage}
        options={PAGES.map((value) => ({ label: c.pages[value], value }))}
        value={page}
      />
      <div className="docs__controls">
        <Segmented
          label={c.controls.style}
          onChange={(next: NimStyle) => setStyle(next)}
          options={[
            { label: 'Ledger', value: 'ledger' },
            { label: 'Vlora', value: 'vlora' },
            { label: 'Console', value: 'console' },
            { label: 'Dispatch', value: 'dispatch' },
          ]}
          value={style}
        />
        <ColorwayPicker label={c.controls.colorway} />
        <Segmented
          label={c.controls.scheme}
          onChange={(next: NimScheme) => setScheme(next)}
          options={[
            { label: c.schemes.light, value: 'light' },
            { label: c.schemes.dark, value: 'dark' },
            { label: c.schemes.system, value: 'system' },
          ]}
          value={scheme}
        />
        {/* Language, not direction: switching it sets `dir` AND `lang`, which
            is what turns on the Persian script corrections and gives the
            calendar its own month names and digits. */}
        <Segmented
          label={c.controls.language}
          onChange={onLang}
          options={[
            { label: 'EN', value: 'en' },
            { label: 'فا', value: 'fa' },
          ]}
          value={lang}
        />
      </div>
    </header>
  )
}

export function App() {
  const [page, setPage] = useState<Page>('foundations')
  const [lang, setLang] = useState<Lang>('en')
  const [active, setActive] = useState<string>(NAV.foundations[0])
  const c = COPY[lang]
  const sections = useMemo(() => NAV[page], [page])

  // Switching page swaps the whole document under the reader; landing them
  // halfway down a page they have never seen is disorienting, so each switch
  // starts at the top and marks the first section current.
  const goToPage = useCallback((next: Page) => {
    setPage(next)
    setActive(NAV[next][0])
    window.scrollTo({ top: 0 })
  }, [])

  // The sidebar follows the reader rather than the click: whichever section
  // owns the top of the viewport is the one marked current.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.docs__section'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' },
    )
    nodes.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [lang, page])

  return (
    <NimProvider
      defaultColorway="vermilion"
      defaultScheme="light"
      defaultStyle="ledger"
      direction={c.dir}
      locale={c.locale}
    >
      <ToastProvider>
        <div className="docs">
          <aside className="docs__sidebar">
            <div className="docs__brand">
              <span className="docs__wordmark">nim</span>
              <Badge size="sm" tone="outline">
                v0.9
              </Badge>
            </div>
            <p className="docs__byline">
              {c.tagline}
              <br />
              {c.bylinePrefix}{' '}
              <a className="docs__byline-link" href="/">
                {lang === 'fa' ? 'نیما سارایان' : 'Nima Sarayan'}
              </a>
            </p>
            {/* Only the current page's sections. A single list of all three
                pages' anchors is 31 links to the same viewport, most of which
                do not exist in the document being read. */}
            <nav aria-label={c.pages[page]} className="docs__nav">
              <p className="nim-label docs__nav-group">{c.pages[page]}</p>
              {sections.map((id) => (
                <a
                  aria-current={active === id ? 'true' : undefined}
                  className="docs__nav-link"
                  href={`#${id}`}
                  key={id}
                  onClick={() => setActive(id)}
                >
                  {c.nav[id]}
                </a>
              ))}
            </nav>
            <a className="docs__back" href="/">
              ← nim.zone
            </a>
          </aside>

          <main className="docs__main">
            <Controls lang={lang} onLang={setLang} onPage={goToPage} page={page} />
            <div className="docs__page">
              {page === 'foundations' ? (
                <Foundations lang={lang} />
              ) : page === 'components' ? (
                <Components lang={lang} />
              ) : (
                <Flows lang={lang} />
              )}
            </div>
          </main>
        </div>
      </ToastProvider>
    </NimProvider>
  )
}
