import type { UiThemeDefinition } from './types'

export const DEFAULT_UI_THEME_ID = 'element'

/**
 * UI 主题注册表。
 * 新主题在 src/shared/styles/themes/ 中提供同名令牌文件后，在此登记即可自动出现在系统设置中。
 */
export const UI_THEMES = [
  {
    id: 'element',
    name: 'Element Plus',
    description: '保留 Element Plus 原生视觉，作为稳定、清晰的默认界面。',
    preview: {
      background: '#f2f3f5',
      surface: '#ffffff',
      primary: '#409eff',
      text: '#303133',
    },
  },
  {
    id: 'apple',
    name: 'Apple Liquid Glass',
    description: 'Apple 液态玻璃风格，半透明磨砂玻璃、柔和折射与悬浮阴影。',
    preview: {
      background: '#f5f5f7',
      surface: 'rgba(255, 255, 255, 0.72)',
      primary: '#0066cc',
      text: '#1d1d1f',
    },
  },
] as const satisfies readonly UiThemeDefinition[]

export type UiThemeId = (typeof UI_THEMES)[number]['id']

export function isUiThemeId(value: string | null): value is UiThemeId {
  return UI_THEMES.some((theme) => theme.id === value)
}