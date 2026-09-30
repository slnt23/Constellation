export const settingsModule = {
  key: 'admin-settings',
  portal: 'admin' as const,
  title: '系统配置',
  description: '为站点设置、导航菜单、模块启停和权限预留统一入口。',
  scope: '站点信息、菜单配置、角色权限、模块开关',
  nextStep: '后续可继续加入日志审计、系统监控和环境配置。',
  status: 'planning' as const,
  statusLabel: '规划中',
  group: {
    key: 'system',
    title: '系统治理',
    description: '负责系统配置、权限、审计和基础能力沉淀。',
  },
}
