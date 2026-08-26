import { useEffect, useState } from 'react'
import { Body, Button, Caption, Display, Icon, Input, Label, Rule, Spinner, Title } from 'nim'
import { COPY, type Lang } from '../copy'
import { Section, Specimen } from '../specimen'

const SURFACE_TOKENS = [
  '--nim-canvas',
  '--nim-canvas-sunken',
  '--nim-surface',
  '--nim-surface-raised',
  '--nim-surface-muted',
]
const INK_TOKENS = ['--nim-ink', '--nim-ink-secondary', '--nim-ink-tertiary', '--nim-ink-inverse']
const ACCENT_TOKENS = [
  '--nim-accent',
  '--nim-accent-hover',
  '--nim-accent-strong',
  '--nim-accent-soft',
  '--nim-accent-line',
]
const STATUS_TOKENS = [
  '--nim-success',
  '--nim-success-soft',
  '--nim-warning',
  '--nim-warning-soft',
  '--nim-danger',
  '--nim-danger-hover',
  '--nim-danger-soft',
  '--nim-info',
  '--nim-info-soft',
]
const LINE_TOKENS = ['--nim-line-soft', '--nim-line', '--nim-line-strong']
const SHADOW_TINT_TOKENS = ['--nim-shadow-tint-sm', '--nim-shadow-tint-md', '--nim-shadow-tint-lg']

const SPACE_STEPS = Array.from({ length: 12 }, (_, index) => index + 1)
const RADIUS_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', 'pill']
const SHADOW_TOKENS = ['sm', 'md', 'lg']
const SIZE_TOKENS = [
  'dot',
  'icon-xs',
  'icon-sm',
  'icon-md',
  'icon-lg',
  'icon-xl',
  'avatar-sm',
  'avatar-md',
  'avatar-lg',
  'track',
  'handle',
]

const CURVES = [
  { key: 'standard', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  { key: 'decelerate', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  { key: 'spring', value: 'cubic-bezier(0.34, 1.5, 0.64, 1)' },
]

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

/** Live, because a curve described in prose is a curve nobody can picture. */
function Curves({ label, playing }: { label: string; playing: boolean }) {
  return (
    <div className="docs__motion">
      {CURVES.map((curve) => (
        <div className="docs__motion-row" key={curve.key}>
          <span className="docs__token docs__motion-name">{curve.key}</span>
          <span className="docs__motion-track">
            <span
              className="docs__motion-puck"
              style={{ animationPlayState: playing ? 'running' : 'paused', animationTimingFunction: curve.value }}
            />
          </span>
          <span className="docs__token docs__motion-value">{curve.value.replace('cubic-bezier', '')}</span>
        </div>
      ))}
      <Caption>{label}</Caption>
    </div>
  )
}

const ASSIGNMENT = [
  { curve: 'standard', dur: '140', key: 'press', width: 22 },
  { curve: 'standard', dur: '140', key: 'hover', width: 22 },
  { curve: '', dur: '', key: 'focusRing', width: 0 },
  { curve: 'decelerate', dur: '240', key: 'menuPopover', width: 38 },
  { curve: 'decelerate', dur: '240', key: 'dialogSheet', width: 38 },
  { curve: 'spring', dur: '240', key: 'toastIn', width: 38 },
  { curve: 'spring', dur: '240', key: 'switchThumb', width: 38 },
  { curve: 'decelerate', dur: '400', key: 'progressFill', width: 64 },
] as const

export function Foundations({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const f = c.f
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)

  // The page reports the viewer's own setting rather than describing it.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return (
    <>
      <div className="docs__intro">
        <Display>{f.introTitle}</Display>
        <Body>{f.introBody}</Body>
      </div>

      <Section id="color" title={c.nav.color}>
        <Body size="sm">{f.colourBody}</Body>
        <Label>{f.surfaces}</Label>
        <Swatches tokens={SURFACE_TOKENS} />
        <Label>{f.ink}</Label>
        <Swatches tokens={INK_TOKENS} />
        <Label>{f.accent}</Label>
        <Swatches tokens={ACCENT_TOKENS} />
        <Label>{f.status}</Label>
        <Swatches tokens={STATUS_TOKENS} />
        <Label>{f.lines}</Label>
        <Swatches tokens={LINE_TOKENS} />
        <Label>{f.shadowTint}</Label>
        <Swatches tokens={SHADOW_TINT_TOKENS} />
        <Caption>{f.shadowTintNote}</Caption>
      </Section>

      <Section id="type" title={c.nav.type}>
        <Specimen
          layout="column"
          title={f.typeRoles}
          code={`<Display>…</Display>\n<Title>…</Title>\n<Body>…</Body>\n<Label>…</Label>\n<Caption>…</Caption>`}
        >
          <Display>{f.displayRole}</Display>
          <Title>{f.titleLarge}</Title>
          <Title size="md">{f.titleMedium}</Title>
          <Body>{f.bodyRole}</Body>
          <Label>{f.labelRole}</Label>
          <span
            style={{
              fontFamily: 'var(--nim-type-control-family)',
              fontSize: 'var(--nim-type-control-size)',
              fontWeight: 'var(--nim-type-control-weight)',
              letterSpacing: 'var(--nim-type-control-tracking)',
              textTransform: 'var(--nim-type-control-transform)' as never,
            }}
          >
            {f.controlRole}
          </span>
          <Caption>{f.captionRole}</Caption>
        </Specimen>
        <Caption>{f.typeNote}</Caption>

        <Specimen
          layout="column"
          title={f.editorialRoles}
          code={`<Display size="lg">…</Display>\n\n<Display size="xl">\n  <Display.Line>Systems that</Display.Line>\n  <Display.Line accent indent>stay fast</Display.Line>\n  <Display.Line>under load.</Display.Line>\n</Display>`}
        >
          <Display size="lg">{f.displayLgRole}</Display>
          <Display size="xl">
            <Display.Line>{f.displayXlRole}</Display.Line>
          </Display>
        </Specimen>
        <Caption>{f.editorialNote}</Caption>
      </Section>

      <Section id="space" title={c.nav.space}>
        <Body size="sm">{f.spaceBody}</Body>
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
        <Rule />
        <Label>{f.sizeTitle}</Label>
        <Body size="sm">{f.sizeBody}</Body>
        <div className="docs__sizes">
          {SIZE_TOKENS.map((token) => (
            <div className="docs__size" key={token}>
              <span
                className="docs__size-chip"
                style={{ blockSize: `var(--nim-size-${token})`, inlineSize: `var(--nim-size-${token})` }}
              />
              <span className="docs__token">--nim-size-{token}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="shape" title={c.nav.shape}>
        <Specimen title={f.radius} note={f.radiusNote}>
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
        <Specimen title={f.elevation} note={f.elevationNote}>
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
      </Section>

      <Section id="focus" title={c.nav.focus}>
        <Body size="sm">{f.focusBody}</Body>
        <Specimen title={f.focusTitle} note={f.focusHint} code={`box-shadow: var(--nim-shadow-focus);`}>
          <Button variant="secondary">{c.t.saveChanges}</Button>
          <Button variant="accent">{c.t.startScan}</Button>
          <Input label={c.t.email} placeholder="you@example.com" />
        </Specimen>
        <Specimen layout="column" title="—" note={f.focusInvalid}>
          <Input error={c.t.fullNameError} label={c.t.fullName} required />
        </Specimen>
      </Section>

      <Section id="density" title={c.nav.density}>
        <Body size="sm">{f.densityBody}</Body>
        <Specimen
          layout="block"
          title={f.densityTitle}
          code={`<div style={{ '--nim-density': 0.82 }}>…</div>`}
        >
          <div className="docs__density">
            {[
              { key: 'compact', label: f.compact, value: '0.82' },
              { key: 'standard', label: f.standard, value: '1' },
              { key: 'roomy', label: f.roomy, value: '1.18' },
            ].map((step) => (
              <div
                className="docs__density-col"
                key={step.key}
                style={{ '--nim-density': step.value } as React.CSSProperties}
              >
                <Label>
                  {step.label} · {step.value}
                </Label>
                <Button variant="secondary">{c.t.saveChanges}</Button>
                <div className="docs__density-row">
                  <Icon name="document" size="sm" />
                  <span style={{ flex: 1 }}>{f.densityRow}</span>
                </div>
              </div>
            ))}
          </div>
        </Specimen>
      </Section>

      <Section id="motion" title={c.nav.motion}>
        <Specimen layout="block" title={f.motionCurves} note={f.motionCurvesNote}>
          <Curves label={reduced ? f.reducedOn : ''} playing={playing && !reduced} />
          <Button
            disabled={reduced}
            iconStart={playing ? 'pause' : 'play'}
            onClick={() => setPlaying((value) => !value)}
            size="sm"
            variant="secondary"
          >
            {playing ? f.pause : f.play}
          </Button>
        </Specimen>

        <Specimen layout="block" title={f.motionDurations}>
          <div className="docs__rows">
            {[
              { body: f.durFast, token: '--nim-dur-fast: 140ms' },
              { body: f.durBase, token: '--nim-dur-base: 240ms' },
              { body: f.durSlow, token: '--nim-dur-slow: 400ms' },
            ].map((row) => (
              <div className="docs__row" key={row.token}>
                <span className="docs__token" style={{ inlineSize: '200px' }}>
                  {row.token}
                </span>
                <Caption>{row.body}</Caption>
              </div>
            ))}
          </div>
        </Specimen>

        <Specimen layout="block" title={f.motionAssignment}>
          <div className="docs__rows">
            {ASSIGNMENT.map((row) => (
              <div className="docs__row" key={row.key}>
                <span className="docs__token" style={{ inlineSize: '140px' }}>
                  {f[row.key]}
                </span>
                {row.width === 0 ? (
                  <Caption>{f.instant}</Caption>
                ) : (
                  <span className="docs__meter" style={{ inlineSize: `${row.width}%` }}>
                    {row.dur} · {row.curve}
                  </span>
                )}
              </div>
            ))}
          </div>
          <Caption>{f.motionAssignmentBody}</Caption>
        </Specimen>

        <Specimen layout="block" title={f.motionReduced}>
          <Body size="sm">{f.motionReducedBody}</Body>
          <div
            className="docs__notice"
            data-on={reduced ? 'true' : undefined}
            style={{ marginBlockStart: 'var(--nim-space-4)' }}
          >
            <Icon name={reduced ? 'check-circle' : 'info'} size="sm" tone={reduced ? 'accent' : 'muted'} />
            <Caption>{reduced ? f.reducedOn : f.reducedOff}</Caption>
          </div>
          <div className="docs__rows" style={{ marginBlockStart: 'var(--nim-space-5)' }}>
            <div className="docs__row">
              <Spinner size="sm" />
              <Caption>{f.keepsTurning}</Caption>
            </div>
            <div className="docs__row">
              <span className="docs__progress-still" />
              <Caption>{f.keepsFilling}</Caption>
            </div>
            <div className="docs__row">
              <span className="docs__skeleton-still" />
              <Caption>{f.goesAway}</Caption>
            </div>
          </div>
        </Specimen>
      </Section>
    </>
  )
}
