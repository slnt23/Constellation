export interface MenuItem {
  title: string
  subtitle: string
  path: string
  image: string
  size?: 'large' | 'normal' | 'small'
}

export interface SpotlightItem {
  id: number
  eyebrow: string
  title: string
  description?: string
  imageUrl: string
  sortOrder: number
  link?: string
  target?: '_self' | '_blank' | '_parent'
}

export interface FeatureItem {
  id: number
  icon: string
  title: string
  description: string
  sortOrder: number
}

export interface SectionIntroData {
  eyebrow: string
  title: string
  description: string
}

export interface StatItem {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

export interface ProfileSelectOption {
  value: string
  label: string
}

export interface ProfileInfoExample {
  label: string
  value: string
}

export interface ProfileCardExample {
  title: string
  description: string
}

export interface ModuleGroup {
  key: string
  title: string
  description: string
  modules: AppModule[]
}

export interface AppModule {
  key: string
  portal: 'front' | 'admin'
  title: string
  description: string
  scope: string
  nextStep: string
  status: 'online' | 'planning' | 'building'
  statusLabel: string
  group: {
    key: string
    title: string
    description: string
  }
}
