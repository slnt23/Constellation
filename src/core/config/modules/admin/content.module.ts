export const contentModule = {
  key: 'admin-content',
  portal: 'admin' as const,
  title: '内容管理',
  description: '统一管理博客、项目说明、页面文案和未来的媒体素材。',
  scope: '文章编辑、分类标签、草稿管理、发布流转',
  nextStep: '后续可以拆成文章管理、媒体库、分类体系三个子域。',
  status: 'building' as const,
  statusLabel: '建设中',
  group: {
    key: 'content',
    title: '内容运营',
    description: '围绕发布、编辑、归档和资源管理展开的后台模块。',
  },
}
