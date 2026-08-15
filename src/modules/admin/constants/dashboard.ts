import type { ProfileCardExample, ProfileInfoExample } from '@/shared/types'

export const ADMIN_OVERVIEW_QUICK_CARDS: ProfileCardExample[] = [
  {
    title: '控制台总览',
    description: '这里可接访问统计、模块状态和待办提醒。',
  },
  {
    title: '内容管理',
    description: '占位承接文章、价格数据、AI 预设和资源配置。',
  },
  {
    title: '系统设置',
    description: '后续可接权限角色、菜单开关和日志记录。',
  },
]

export const ADMIN_OVERVIEW_FEATURE_CARDS: ProfileCardExample[] = [
  {
    title: '数据看板',
    description: '编辑部风格主区块改造成后台概览看板。',
  },
  {
    title: '菜单管理',
    description: '预留给后台菜单、入口排序和模块开关管理。',
  },
  {
    title: '用户与权限',
    description: '后续可接角色、权限组和登录审计能力。',
  },
  {
    title: '运营内容',
    description: '占位给文章、图片、报价内容和配置项管理。',
  },
]

export const ADMIN_SETTINGS_INFO_FALLBACK: ProfileInfoExample[] = [
  { label: '当前角色', value: '未登录' },
  { label: '管理模式', value: '管理员后台界面已独立于前台导航显示。' },
  { label: '退出方式', value: '侧栏底部可退出登录并返回登录页。' },
]
