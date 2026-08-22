import { Body, Caption, Display, Label, Rule, Title } from 'nim'
import { Section, Specimen } from '../specimen'

const SURFACE_TOKENS = [
  '--nim-canvas',
  '--nim-canvas-sunken',
  '--nim-surface',
  '--nim-surface-raised',
  '--nim-surface-muted',
]
const INK_TOKENS = ['--nim-ink', '--nim-ink-secondary', '--nim-ink-tertiary', '--nim-ink-inverse']
const ACCENT_TOKENS = ['--nim-accent', '--nim-accent-strong', '--nim-accent-soft', '--nim-accent-line']
const STATUS_TOKENS = [
  '--nim-success',
  '--nim-success-soft',
  '--nim-warning',
  '--nim-warning-soft',
  '--nim-danger',
  '--nim-danger-soft',
  '--nim-info',
  '--nim-info-soft',
]
const LINE_TOKENS = ['--nim-line-soft', '--nim-line', '--nim-line-strong']

const SPACE_STEPS = Array.from({ length: 12 }, (_, index) => index + 1)
const RADIUS_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', 'pill']
const SHADOW_TOKENS = ['sm', 'md', 'lg']

function Swatches({ tokens }: { tokens: string[] }) {
  return (
    <div className="docs__grid">
      {tokens.map((token) => (
        <div className="docs__swatch" key={token}>
          <div className="docs__swatch-chip" style={{ background: `var(${token})` }} />
          <div className="docs__swatch-meta">
            <p className="docs__token">{token}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Foundations() {
  return (
    <>
      <div className="docs__intro">
        <Display>The tokens are the system.</Display>
        <Body>
          Components speak only the names below. Swap the theme and every screen changes at once,
          because nothing downstream of this contract holds a literal value.
        </Body>
      </div>

      <Section id="color" title="Colour">
        <Body size="sm">
          Roles, never literals. Ledger reads these as paper and ink with a print vermilion signal;
          Vlora reads them as warm cream with a coral accent.
        </Body>
        <Label>Surfaces</Label>
        <Swatches tokens={SURFACE_TOKENS} />
        <Label>Ink</Label>
        <Swatches tokens={INK_TOKENS} />
        <Label>Accent</Label>
        <Swatches tokens={ACCENT_TOKENS} />
        <Label>Status</Label>
        <Swatches tokens={STATUS_TOKENS} />
        <Label>Lines</Label>
        <Swatches tokens={LINE_TOKENS} />
      </Section>

      <Section id="type" title="Type">
        <Specimen layout="column" title="Roles" code={`<Display>…</Display>\n<Title>…</Title>\n<Title size="md">…</Title>\n<Body>…</Body>\n<Label>…</Label>\n<Caption>…</Caption>`}>
          <Display>Display</Display>
          <Title>Title, large</Title>
          <Title size="md">Title, medium</Title>
          <Body>
            Body copy carries the substance. It sits at a comfortable measure and never competes
            with the headings above it.
          </Body>
          <Label>Label · the theme&apos;s signature</Label>
          <Caption>Caption — secondary, quiet, and never load-bearing.</Caption>
        </Specimen>
        <Caption>
          The label role is where the two themes diverge most: Ledger sets it in mono, uppercase and
          wide-tracked; Vlora sets it in the text face at sentence case, because Persian neither
          uppercases nor letterspaces.
        </Caption>
      </Section>

      <Section id="space" title="Space">
        <Body size="sm">A 4px base. Components consume steps, never raw pixels.</Body>
        <div style={{ marginBlockStart: 'var(--nim-space-4)' }}>
          {SPACE_STEPS.map((step) => (
            <div className="docs__scale-row" key={step}>
              <span className="docs__token" style={{ inlineSize: '140px' }}>
                --nim-space-{step}
              </span>
              <span className="docs__scale-bar" style={{ inlineSize: `var(--nim-space-${step})` }} />
            </div>
          ))}
        </div>
      </Section>

      <Section id="shape" title="Shape & elevation">
        <Specimen title="Radius" note="square in Ledger, rounded in Vlora">
          {RADIUS_TOKENS.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--nim-surface-muted)',
                  border: '1px solid var(--nim-line)',
                  borderRadius: `var(--nim-radius-${token})`,
                  blockSize: '64px',
                  inlineSize: '64px',
                }}
              />
              <p className="docs__token" style={{ marginBlockStart: 'var(--nim-space-2)' }}>
                {token}
              </p>
            </div>
          ))}
        </Specimen>
        <Specimen title="Elevation" note="hard offset in Ledger, ambient in Vlora">
          {SHADOW_TOKENS.map((token) => (
            <div key={token} style={{ textAlign: 'center' }}>
              <div
                style={{
                  background: 'var(--nim-surface)',
                  border: '1px solid var(--nim-line)',
                  borderRadius: 'var(--nim-radius-md)',
                  boxShadow: `var(--nim-shadow-${token})`,
                  blockSize: '64px',
                  inlineSize: '96px',
                }}
              />
              <p className="docs__token" style={{ marginBlockStart: 'var(--nim-space-2)' }}>
                shadow-{token}
              </p>
            </div>
          ))}
        </Specimen>
        <Rule />
      </Section>

      <Section id="motion" title="Motion">
        <Body size="sm">
          Three durations, three curves, and a global reduced-motion switch. `spring` is reserved
          for elements that enter; everything else uses `standard`.
        </Body>
        <pre className="docs__code" style={{ marginBlockStart: 'var(--nim-space-4)' }}>
{`--nim-dur-fast: 140ms   --nim-ease-standard
--nim-dur-base: 240ms   --nim-ease-decelerate
--nim-dur-slow: 400ms   --nim-ease-spring`}
        </pre>
      </Section>
    </>
  )
}
