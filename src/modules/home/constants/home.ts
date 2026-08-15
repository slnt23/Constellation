import type { SectionIntroData, StatItem } from '@/shared/types'

// 首页内容区的介绍数据，每个对象包含眉头、标题和描述
export const HOME_SECTION_INTROS: SectionIntroData[] = [
  {
    eyebrow: '内容精选',
    title: 'Curated Highlights',
    description: '值得浏览的内容与最新呈现',
  },
  {
    eyebrow: '探索发现',
    title: 'Creative Discoveries',
    description: '围绕兴趣、创作与体验的核心内容集合',
  },
  {
    eyebrow: '了解更多',
    title: 'Explore More',
    description: '进入各个功能模块，发现更多有趣的内容与服务',
  },
]

export const EXAMPLE_HOME_STATS: StatItem[] = [
  { value: 1280, suffix: '+', label: '数据条目覆盖' },
  { value: 36, label: '监测区域' },
  { value: 98, suffix: '%', label: '数据准确率' },
  { value: 12, suffix: 'K', label: '活跃用户' },
]
