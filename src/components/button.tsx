import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from '@/components/icon'
import { cn } from '@/lib/cn'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonVariant = 'accent' | 'danger' | 'ghost' | 'primary' | 'secondary'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  fullWidth?: boolean
  /** Icon on the trailing edge — travels with the reading direction. */
  iconEnd?: IconName
  iconStart?: IconName
  /** Blocks interaction and announces busy; the label stays in place so the
      button does not change width mid-request. */
  loading?: boolean
  size?: ButtonSize
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  disabled = false,
  fullWidth = false,
  iconEnd,
  iconStart,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      aria-busy={loading || undefined}
      className={cn(
        'nim-button',
        `nim-button--${variant}`,
        `nim-button--${size}`,
        fullWidth && 'nim-button--full',
        loading && 'nim-button--loading',
        className,
      )}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? <span aria-hidden="true" className="nim-button__spinner" /> : null}
      {!loading && iconStart ? <Icon name={iconStart} size="sm" /> : null}
      <span className="nim-button__label">{children}</span>
      {iconEnd ? <Icon name={iconEnd} size="sm" /> : null}
    </button>
  )
}
