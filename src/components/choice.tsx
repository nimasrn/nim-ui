import type { InputHTMLAttributes, ReactNode } from 'react'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/cn'

interface ChoiceBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode
  description?: string
}

export type CheckboxProps = ChoiceBaseProps
export type SwitchProps = ChoiceBaseProps

/**
 * Both controls keep a real `<input>` in the tree — visually hidden but
 * focusable — so keyboard behaviour, form participation, and assistive tech
 * come from the platform rather than from re-implemented ARIA.
 */
export function Checkbox({ children, className, description, ...props }: CheckboxProps) {
  return (
    <label className={cn('nim-choice nim-choice--checkbox', className)}>
      <input className="nim-choice__input" type="checkbox" {...props} />
      <span aria-hidden="true" className="nim-checkbox__box">
        <Icon name="check" size="xs" />
      </span>
      <span className="nim-choice__text">
        {children}
        {description ? <span className="nim-choice__description">{description}</span> : null}
      </span>
    </label>
  )
}

export function Switch({ children, className, description, ...props }: SwitchProps) {
  return (
    <label className={cn('nim-choice nim-choice--switch', className)}>
      <input className="nim-choice__input" role="switch" type="checkbox" {...props} />
      <span aria-hidden="true" className="nim-switch__track">
        <span className="nim-switch__thumb" />
      </span>
      <span className="nim-choice__text">
        {children}
        {description ? <span className="nim-choice__description">{description}</span> : null}
      </span>
    </label>
  )
}
