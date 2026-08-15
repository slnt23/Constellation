export const blogModule = {
  key: 'front-blog',
  portal: 'front' as const,
  title: '内容中心',
  description: '用于承载博客、教程、笔记和阶段性输出，帮助网站持续生长。',
  scope: '文章列表、详情页、分类标签、归档检索',
  nextStep: '接入 Markdown 或 CMS 数据源后，可以独立成完整内容系统。',
  status: 'building' as const,
  statusLabel: '建设中',
  group: {
    key: 'content',
    title: '内容表达',
    description: '围绕文字、教程、归档与知识沉淀的模块。',
  },
}
