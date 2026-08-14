import type {
  // AdminDashboardSectionId,
  // AdminDashboardSectionMeta,
  FeatureItem,
  ProfileCardExample,
  ProfileInfoExample,
  // ProfileSectionItem,
  ProfileSelectOption,
  // PublicProfileFormExampleDefaults,
  SpotlightItem,
  StatItem,
} from '@/types'
import projectImageOne from '@/assets/example/editorial-hero-01.jpg'
import projectImageTwo from '@/assets/example/editorial-hero-02.jpg'
import projectImageThree from '@/assets/example/banner.jpg'


import type { StoryGalleryItem } from '@/types'
import galleryImage01 from '@/assets/example/editorial-hero-01.jpg'
import galleryImage02 from '@/assets/example/editorial-hero-02.jpg'
import galleryImage03 from '@/assets/example/banner.jpg'
import galleryImage04 from '@/assets/example/login-hero-bg-01.jpg'
import galleryImage05 from '@/assets/example/login-hero-bg-02.jpg'
import galleryImage06 from '@/assets/example/login-hero-bg-03.jpg'
import galleryImage07 from '@/assets/example/pic04.jpg'
import galleryImage08 from '@/assets/example/pic05.jpg'
import galleryImage09 from '@/assets/example/default_avatar.png'
import galleryImage10 from '@/assets/example/brand_home_header.png'
import galleryImage11 from '@/assets/example/vue.svg'
import galleryImage12 from '@/assets/example/editorial-hero-01.jpg'

const defaultDescription =
  'Nunc blandit nisi ligula magna sodales lectus elementum non. Integer id venenatis velit.'

export const STORY_GALLERY_ITEMS: StoryGalleryItem[] = [
  { title: 'Magna Feugiat Lorem', description: defaultDescription, image: galleryImage01, thumbnail: galleryImage01 },
  { title: 'Nisl Adipiscing', description: defaultDescription, image: galleryImage02, thumbnail: galleryImage02 },
  { title: 'Tempus Aliquam Veroeros', description: defaultDescription, image: galleryImage03, thumbnail: galleryImage03 },
  { title: 'Aliquam Ipsum Sed Dolore', description: defaultDescription, image: galleryImage04, thumbnail: galleryImage04 },
  { title: 'Cursis Aliquam Nisl', description: defaultDescription, image: galleryImage05, thumbnail: galleryImage05 },
  { title: 'Sed Consequat Phasellus', description: defaultDescription, image: galleryImage06, thumbnail: galleryImage06 },
  { title: 'Mauris Id Tellus Arcu', description: defaultDescription, image: galleryImage07, thumbnail: galleryImage07 },
  { title: 'Nunc Vehicula Id Nulla', description: defaultDescription, image: galleryImage08, thumbnail: galleryImage08 },
  { title: 'Neque Et Faucibus Viverra', description: defaultDescription, image: galleryImage09, thumbnail: galleryImage09 },
  { title: 'Mattis Ante Fermentum', description: defaultDescription, image: galleryImage10, thumbnail: galleryImage10 },
  { title: 'Sed Ac Elementum Arcu', description: defaultDescription, image: galleryImage11, thumbnail: galleryImage11 },
  { title: 'Vehicula Id Nulla Dignissim', description: defaultDescription, image: galleryImage12, thumbnail: galleryImage12 },
]


export const SPOTLIGHT_ITEMS: SpotlightItem[] = [
  {
    id: 1,
    eyebrow: 'Brand System',
    title: '个人品牌与',
    description:
      '保留模板里强叙事的首屏',
    imageUrl: projectImageOne,
    sortOrder: 1,
    link: '/brand',
    target: '_self',
  },
  {
    id: 2,
    eyebrow: 'Project Layer',
    title: '每个兴趣项目',
    description:
      '站点会持续扩展新的兴趣模块。',
    imageUrl: projectImageTwo,
    sortOrder: 2,
    link: '/projects',
    target: '_self',
  },
  {
    id: 3,
    eyebrow: 'Growth System',
    title: '从前台展示平滑过渡',
    description:
      '现在先完成前台官网',
    imageUrl: projectImageThree,
    sortOrder: 3,
    link: '/growth',
    target: '_self',
  },
  {
    id: 3,
    eyebrow: 'Growth System',
    title: '从前台展示平滑过渡',
    description:
      '现在先完成前台官网',
    imageUrl: projectImageThree,
    sortOrder: 4,
    link: '/growth',
    target: '_self',
  },
  {
    id: 3,
    eyebrow: 'Growth System',
    title: '从前台展示平滑过渡',
    description:
      '现在先完成前台官网',
    imageUrl: projectImageThree,
    sortOrder: 5,
    link: '/growth',
    target: '_self',
  },
  {
    id: 3,
    eyebrow: 'Growth System',
    title: '从前台展示平滑过渡',
    description:
      '现在先完成前台官网',
    imageUrl: projectImageThree,
    sortOrder: 6,
    link: '/growth',
    target: '_self',
  },
]

// export const FEATURE_ITEMS: FeatureItem[] = [
//   {
//     icon: '01',
//     title: '一眼入魂',
//     description: '首页首屏用一张大图镇场，一句话稳稳放在正中间，什么多余都没有，就是让你“哇”。',
//   },
//   {
//     icon: '02',
//     title: '天空色号',
//     description: '配色换成天蓝、雾白、高光感，不再是深海压抑风，而是初夏下午三点的轻松。',
//   },
//   {
//     icon: '03',
//     title: '『滑一下，乖一点』',
//     description: '刚进来时菜单在右边酷酷的，往下滑它就悄悄缩到左边，不挡视野，懂事。',
//   },
//   {
//     icon: '04',
//     title: '『点 MENU 像拆盒』',
//     description: '打开菜单是一排可可爱爱的图片格子，点进去就能逛到各种有趣的小角落。',
//   },
// ]


export const EXAMPLE_PUBLIC_PROFILE_EMAIL_OPTIONS: ProfileSelectOption[] = [
  { value: '', label: '选择已验证邮箱以展示' },
  { value: 'verified@kite.local', label: 'verified@kite.local' },
]

// export const EXAMPLE_PUBLIC_PROFILE_PRONOUNS_OPTIONS: ProfileSelectOption[] = [
//   { value: '', label: '不指定' },
//   { value: 'he/him', label: 'He/him' },
//   { value: 'she/her', label: 'She/her' },
//   { value: 'they/them', label: 'They/them' },
// ]

// export const EXAMPLE_PUBLIC_PROFILE_HINTS = {
//   displayName:
//     '你的姓名可能会显示在站点中你参与协作或被提及的位置，可随时修改或清空。',
//   publicEmail:
//     '你已将邮箱设为私密。要调整展示方式，请到「邮箱设置」中取消勾选「对外隐藏邮箱」。',
//   bio: '可以 @ 其他用户或组织，生成指向对方的链接。',
//   pronouns: '',
//   websiteUrl: '',
// } as const

// export const PROFILE_SECTION_ITEMS: ProfileSectionItem[] = [
//   {
//     id: 'public',
//     label: '公开资料',
//     heading: '公开资料',
//     description: '管理个人资料页中展示的身份信息与公开链接。',
//   },
//   {
//     id: 'account',
//     label: '账户',
//     heading: '账户',
//     description: '查看当前账户详情、登录方式与核心联系信息。',
//   },
//   {
//     id: 'appearance',
//     label: '外观',
//     heading: '外观',
//     description: '调整工作区的视觉样式、界面密度与展示偏好。',
//   },
//   {
//     id: 'accessibility',
//     label: '无障碍',
//     heading: '无障碍',
//     description: '配置更易读的文字、更低动效与辅助浏览偏好。',
//   },
//   {
//     id: 'notifications',
//     label: '通知',
//     heading: '通知',
//     description: '管理账户动态、系统更新与 AI 助手相关提醒。',
//   },
// ]

export const PROFILE_ACCOUNT_CARDS: ProfileInfoExample[] = [
  { label: '当前身份', value: '个人账户' },
  { label: '登录方式', value: '邮箱验证' },
  { label: '最近活动', value: '未记录' },
  { label: '主邮箱', value: 'guest@kite.local' },
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

// /** 管理后台各 tab 文案（示例，后续接接口） */
// export const ADMIN_DASHBOARD_SECTION_META: Record<AdminDashboardSectionId, AdminDashboardSectionMeta> = {
//   overview: {
//     eyebrow: '管理后台',
//     heading: '控制台总览',
//     description: '这里可接访问统计、模块状态和待办提醒；下方为能力占位，与原先控制台文案一致。',
//   },
//   content: {
//     eyebrow: '管理后台',
//     heading: '内容管理',
//     description: '占位承接文章、价格数据、AI 预设和资源配置；卡片区域用于后续接入列表与编辑器。',
//   },
//   settings: {
//     eyebrow: '管理后台',
//     heading: '系统设置',
//     description: '后续可接权限角色、菜单开关和日志记录；当前展示账户与后台环境说明。',
//   },
// }

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

// ─── 首页统计区示例数据 ───
export const EXAMPLE_HOME_STATS: StatItem[] = [
  { value: 1280, suffix: '+', label: '数据条目覆盖' },
  { value: 36, label: '监测区域' },
  { value: 98, suffix: '%', label: '数据准确率' },
  { value: 12, suffix: 'K', label: '活跃用户' },
]
