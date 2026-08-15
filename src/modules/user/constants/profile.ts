import type { NavSection, ProfileCardExample, ProfileSelectOption } from '@/shared/types'

// GitHub 风格设置侧栏：用户
export const PROFILE_SETTINGS_NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { id: 'public', label: '公开资料', icon: 'user', navigable: true },
      { id: 'account', label: '账户', icon: 'setting', navigable: true },
      // { id: 'appearance', label: '外观', icon: 'brush', navigable: true },
    ],
  },
  {
    title: '访问',
    items: [
      { id: 'access-billing', label: '账单与许可', icon: 'creditCard', expandable: true, navigable: false },
    ],
  },
  {
    // 用来与退出登陆分隔
  },
]

export const PROFILE_APPEARANCE_CARDS: ProfileCardExample[] = [
  {
    title: '界面密度',
    description: '使用舒展且均衡的排版，让设置项更容易浏览与对比。',
  },
  {
    title: '圆角样式',
    description: '控件采用方形圆角外观，与参考图中的侧栏与面板风格保持一致。',
  },
  {
    title: '层级关系',
    description: '减少厚重边框与装饰，通过留白和浅色背景来划分信息层次。',
  },
]

export const PROFILE_ACCESSIBILITY_CARDS: ProfileCardExample[] = [
  {
    title: '易读排版',
    description: '在桌面端保持舒适阅读比例，同时让移动端布局更轻盈清爽。',
  },
  {
    title: '减少动效',
    description: '优先使用更轻的过渡效果，避免过强的面板动画带来视觉疲劳。',
  },
]

export const PROFILE_NOTIFICATION_CARDS: ProfileCardExample[] = [
  {
    title: '价格提醒',
    description: '按品类、地区或材料跟踪价格变化，并及时接收动态通知。',
  },
  {
    title: 'AI 助手动态',
    description: '当长会话、摘要或任务结果生成完成时，第一时间收到提醒。',
  },
  {
    title: '安全消息',
    description: '接收重要的账户访问提醒、会话变化通知与策略更新摘要。',
  },
]

export const EXAMPLE_PUBLIC_PROFILE_EMAIL_OPTIONS: ProfileSelectOption[] = [
  { value: '', label: '选择已验证邮箱以展示' },
  { value: 'verified@kite.local', label: 'verified@kite.local' },
]
