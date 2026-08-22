/**
 * nim — public surface.
 *
 * Importing the kit brings its stylesheet with it, so a consumer can never end
 * up with nim markup and no nim styles. Apps that need to control CSS order
 * themselves can import `nim/styles.css` explicitly instead.
 *
 * Wrap the tree in <NimProvider> to pick a theme, scheme, and direction.
 */

import '@/theme/index.css'

export { Avatar } from '@/components/avatar'
export type { AvatarProps, AvatarSize } from '@/components/avatar'

export { Badge } from '@/components/badge'
export type { BadgeProps, BadgeSize, BadgeTone, BadgeVariant } from '@/components/badge'

export { Banner } from '@/components/banner'
export type { BannerProps, BannerTone } from '@/components/banner'

export { Button } from '@/components/button'
export type { ButtonProps, ButtonSize, ButtonVariant } from '@/components/button'

export { Card } from '@/components/card'
export type { CardPadding, CardProps, CardVariant } from '@/components/card'

export { Checkbox, Switch } from '@/components/choice'
export type { CheckboxProps, SwitchProps } from '@/components/choice'

export { EmptyState } from '@/components/empty-state'
export type { EmptyStateProps } from '@/components/empty-state'

export { Progress, Skeleton, Spinner } from '@/components/feedback'
export type { ProgressProps, SkeletonProps, SpinnerProps } from '@/components/feedback'

export { Input, Select, Textarea } from '@/components/field'
export type { InputProps, SelectOption, SelectProps, TextareaProps } from '@/components/field'

export { Icon, iconNames } from '@/components/icon'
export type { IconName, IconProps, IconSize, IconTone } from '@/components/icon'

export { IconButton } from '@/components/icon-button'
export type { IconButtonProps, IconButtonSize, IconButtonVariant } from '@/components/icon-button'

export { AppFrame, Inline, Stack } from '@/components/layout'

export { List, ListRow } from '@/components/list'
export type { ListProps, ListRowProps } from '@/components/list'

export { SectionHeader } from '@/components/section-header'
export type { SectionHeaderProps } from '@/components/section-header'

export { Segmented } from '@/components/segmented'
export type { SegmentedOption, SegmentedProps } from '@/components/segmented'

export { Sheet } from '@/components/sheet'
export type { SheetProps } from '@/components/sheet'

export { Slider } from '@/components/slider'
export type { SliderProps } from '@/components/slider'

export { Stat } from '@/components/stat'
export type { StatProps } from '@/components/stat'

export { NimProvider, useNim, useSchemeToggle } from '@/components/theme'
export type { NimDirection, NimProviderProps, NimScheme, NimTheme } from '@/components/theme'

export { ToastProvider, useToast } from '@/components/toast'
export type { ToastOptions, ToastTone } from '@/components/toast'

export { Body, Caption, Display, Label, Rule, Title } from '@/components/typography'

export { cn } from '@/lib/cn'
export type { ClassValue } from '@/lib/cn'
