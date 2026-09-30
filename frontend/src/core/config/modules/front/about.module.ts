export const aboutModule = {
  key: 'front-about',
  portal: 'front' as const,
  title: '个人主页',
  description: '展示你的身份、经历、擅长方向和当前兴趣，作为整个网站的总入口。',
  scope: '个人介绍、价值主张、联系方式、对外链接',
  nextStep: '后续可加入时间线、技能标签、履历和联系方式表单。',
  status: 'online' as const,
  statusLabel: '已就绪',
  group: {
    key: 'brand',
    title: '品牌展示',
    description: '第一印象与个人品牌表达相关的前台模块。',
  },
}
