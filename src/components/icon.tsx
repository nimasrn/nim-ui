import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Heart,
  Info,
  Loader,
  LogOut,
  Menu,
  Minus,
  Moon,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Sun,
  Trash2,
  TrendingDown,
  TrendingUp,
  Upload,
  User,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SVGProps } from 'react'
import { cn } from '@/lib/cn'

/**
 * Icons are addressed by role, not by vendor name. The registry is the whole
 * point: it keeps the icon set finite and reviewable, it stops two screens
 * meaning "delete" with two different glyphs, and it means swapping icon
 * libraries later is one file rather than a codebase sweep.
 */
const REGISTRY = {
  alert: AlertTriangle,
  'arrow-forward': ArrowRight,
  bell: Bell,
  bookmark: Bookmark,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  'check-circle': CircleCheck,
  'chevron-back': ChevronLeft,
  'chevron-down': ChevronDown,
  'chevron-forward': ChevronRight,
  'chevron-up': ChevronUp,
  clock: Clock,
  close: X,
  copy: Copy,
  danger: CircleAlert,
  document: FileText,
  download: Download,
  edit: Pencil,
  external: ExternalLink,
  eye: Eye,
  filter: Filter,
  heart: Heart,
  info: Info,
  loading: Loader,
  menu: Menu,
  minus: Minus,
  moon: Moon,
  plus: Plus,
  search: Search,
  settings: Settings,
  share: Share2,
  'sign-out': LogOut,
  sparkle: Sparkles,
  star: Star,
  sun: Sun,
  trash: Trash2,
  'trend-down': TrendingDown,
  'trend-up': TrendingUp,
  upload: Upload,
  user: User,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof REGISTRY
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconTone = 'accent' | 'danger' | 'default' | 'muted' | 'success' | 'warning'

const SIZES: Record<IconSize, number> = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Give a label only when the icon is the sole carrier of meaning. */
  label?: string
  name: IconName
  size?: IconSize
  tone?: IconTone
}

export function Icon({ className, label, name, size = 'md', tone = 'default', ...props }: IconProps) {
  const Glyph = REGISTRY[name]

  return (
    <Glyph
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn('nim-icon', className)}
      data-tone={tone === 'default' ? undefined : tone}
      focusable="false"
      height={SIZES[size]}
      role={label ? 'img' : undefined}
      strokeWidth={1.75}
      width={SIZES[size]}
      {...props}
    />
  )
}

export const iconNames = Object.keys(REGISTRY) as IconName[]
