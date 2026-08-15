export const dashboardModule = {
  key: 'admin-dashboard',
  portal: 'admin' as const,
  title: '控制台总览',
  description: '后台首页总览区，汇总访问、内容、模块状态和待办信息。',
  scope: '统计卡片、快捷入口、系统提示、最近动态',
  nextStep: '接入真实数据后，这里会成为你的后台驾驶舱。',
  status: 'online' as const,
  statusLabel: '已就绪',
  group: {
    key: 'ops',
    title: '运营控制',
    description: '用于管理整体站点运营的后台核心模块。',
  },
}
