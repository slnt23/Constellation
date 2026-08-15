import { DataAnalysis, Folder, Grid, Monitor, Picture, Setting, User } from '@element-plus/icons-vue'

export interface AdminMenuItem {
  path: string
  label: string
  icon: unknown
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  { path: '/admin/dashboard/overview', label: '控制台', icon: Monitor },
  { path: '/admin/dashboard/content', label: '内容管理', icon: Folder },
  { path: '/admin/dashboard/users', label: '用户管理', icon: User },
  { path: '/admin/dashboard/roles', label: '角色管理', icon: DataAnalysis },
  { path: '/admin/dashboard/spotlight', label: '焦点项目', icon: Picture },
  { path: '/admin/dashboard/features', label: '特性管理', icon: Grid },
  { path: '/admin/dashboard/settings', label: '系统设置', icon: Setting },
]
