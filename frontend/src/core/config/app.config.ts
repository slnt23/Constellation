export const appMeta = {
  name: 'Kite Studio',
  eyebrow: 'Personal Web Operating System',
  title: '面向长期扩展的个人网站架构',
  summary:
    '先把个人品牌展示、内容发布、实验项目和后台管理统一到一个 Vue 项目骨架中，后面新增模块时只需要注册配置和补业务实现。',
  goals: [
    '前台与后台共用一套设计语言与基础能力',
    '模块注册式扩展，避免后期功能变多后难维护',
    '共享组件、数据服务、权限入口逐步沉淀',
  ],
  hero: {
    eyebrow: 'Kite Studio',
    headline: '兴趣驱动的个人网点',
    subtitle: '并发，模块化，Agent, AI，内容创作，长期演进',
    cta: '探索更多',
  },
}

export const portalOptions = [
  {
    key: 'front',
    label: '前台站点',
    description: '面向访客的个人主页、内容、作品与兴趣模块',
  },
  {
    key: 'admin',
    label: '后台管理',
    description: '面向你自己的内容运营、模块配置与系统管理',
  },
]
