import type { ReactNode } from 'react'
import { Label } from 'nim'

/**
 * One documented example: a title, the live component, and the exact call that
 * produced it. Keeping the snippet next to the render is what stops the docs
 * from drifting away from the kit.
 */
export function Specimen({
  children,
  code,
  layout = 'inline',
  note,
  title,
}: {
  children: ReactNode
  code?: string
  layout?: 'block' | 'column' | 'inline'
  note?: string
  title: string
}) {
  return (
    <div className="docs__specimen">
      <div className="docs__specimen-head">
        <Label>{title}</Label>
        {note ? <span className="nim-caption">{note}</span> : null}
      </div>
      <div
        className={
          layout === 'inline'
            ? 'docs__stage'
            : layout === 'column'
              ? 'docs__stage docs__stage--column'
              : 'docs__stage docs__stage--block'
        }
      >
        {children}
      </div>
      {code ? <pre className="docs__code">{code}</pre> : null}
    </div>
  )
}

export function Section({ children, id, title }: { children: ReactNode; id: string; title: string }) {
  return (
    <section className="docs__section" id={id}>
      <h2 className="nim-title">{title}</h2>
      {children}
    </section>
  )
}
