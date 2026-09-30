export const projectsModule = {
  key: 'front-projects',
  portal: 'front' as const,
  title: '项目与兴趣实验室',
  description: '适合挂载你的作品集、实验项目、导航页或任何未来感兴趣的新模块。',
  scope: '项目卡片、专题页、兴趣子模块入口',
  nextStep: '后续新增功能时，优先按独立模块接入，避免把所有功能堆进首页。',
  status: 'planning' as const,
  statusLabel: '规划中',
  group: {
    key: 'explore',
    title: '兴趣扩展',
    description: '承接持续增长的新想法、新项目和实验型功能。',
  },
}
