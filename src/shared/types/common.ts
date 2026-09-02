export type IconKey =
  | 'user'
  | 'setting'
  | 'brush'
  | 'view'
  | 'bell'
  | 'creditCard'
  | 'message'
  | 'lock'
  | 'monitor'
  | 'key'
  | 'officeBuilding'
  | 'compass'
  | 'chatWarning'
  | 'folder'
  | 'share'
  | 'box'

export type DashboardSectionId =
  | 'overview'
  | 'content'
  | 'settings'
  | 'user'
  | 'role'
  | 'spotlight'
  | 'feature'
  | 'public'
  | 'account'
  | 'appearance'
  | 'accessibility'
  | 'notifications'
  | 'access-billing'
  | 'gallery'

export interface NavSection {
  title?: string
  items?: NavItem[]
}

export interface NavItem {
  id: DashboardSectionId
  label: string
  icon: IconKey
  badge?: string
  expandable?: boolean
  navigable?: boolean
  disabled?: boolean
}