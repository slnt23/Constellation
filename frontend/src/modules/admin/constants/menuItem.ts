import type { ProfileSelectOption } from '@/shared/types'

/**
 * 菜单项可跳转的前端路由选项。
 *
 * 真源是 `@/core/router/modules/front.routes.ts`——这里是给后台下拉用的白名单，
 * 目的是避免管理员填出打不开的死链。**新增前台路由时需要同步这里**。
 */
export const FRONT_ROUTE_OPTIONS: ProfileSelectOption[] = [
  { value: '/price-query', label: '价格行情 (/price-query)' },
  { value: '/story', label: '沿途纪事 (/story)' },
  { value: '/ai-ai', label: 'AI 伴聊 (/ai-ai)' },
  { value: '/blog', label: '写点什么 · 博客 (/blog)' },
  { value: '/meditations', label: '冥想 (/meditations)' },
  { value: '/profile', label: '个人资料 (/profile)' },
]

/** 菜单卡片尺寸选项，对应 MenuPanel 的石格栅跨度 */
export const CARD_SIZE_OPTIONS: ProfileSelectOption[] = [
  { value: 'large', label: '大（占 4 行）' },
  { value: 'normal', label: '中（占 3 行）' },
  { value: 'small', label: '小（占 2 行）' },
]
