import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/** The mobile app viewport, centred on a desktop screen. */
export function AppFrame({ children, className, ...props }: BoxProps) {
  return (
    <div className={cn('nim-app-frame', className)} {...props}>
      {children}
    </div>
  )
}

/** Vertical rhythm. Spacing between components belongs to the page, not to
    the components, and this is where the page expresses it. */
export function Stack({
  children,
  className,
  gap = 'md',
  ...props
}: BoxProps & { gap?: 'loose' | 'md' | 'tight' }) {
  return (
    <div className={cn('nim-stack', gap !== 'md' && `nim-stack--${gap}`, className)} {...props}>
      {children}
    </div>
  )
}

export function Inline({ children, className, ...props }: BoxProps) {
  return (
    <div className={cn('nim-inline', className)} {...props}>
      {children}
    </div>
  )
}
