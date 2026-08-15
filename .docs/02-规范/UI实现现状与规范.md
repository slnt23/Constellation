# UI 实现现状与规范

## 1. 结论

项目当前 UI 是 **Element Plus + 手写组件混合模式**：

- 表单、弹窗、表格、菜单、上传、消息反馈等通用交互主要使用 Element Plus。
- 首页、博客、画廊、冥想、AI 聊天等品牌/叙事型界面主要手写 HTML + SCSS。
- 两套体系共用一个设计令牌系统，Element Plus 主题已通过 `_element-plus.scss` 覆盖。

## 2. 统计概况

| 指标 | 数值 |
| --- | --- |
| Vue 文件总数 | 47 |
| 使用 Element Plus 组件的文件 | 14 |
| Element Plus 标签出现次数 | 约 237 |
| Element Plus 注册方式 | 全局注册 + unplugin 自动导入 |
| 主题覆盖 | `src/shared/styles/_element-plus.scss` |

## 3. Element Plus 主导区域

| 模块 | 代表文件 | 主要 EP 能力 |
| --- | --- | --- |
| 后台 CRUD | `UserManageSection`、`SpotlightManageSection`、`FeatureManageSection`、`RoleManageSection` | Table / Form / Dialog / Upload / Message |
| 登录 | `LoginDialog` | Dialog / Tabs / Form / Input / Button |
| 账户设置 | `ProfileAccountSection` | Form / Input / Button / Message |
| 价格查询 | `PriceLatest`、`PriceTrend`、`PriceRegion`、`PriceSource`、`PriceItemQuery` | Select / Input / Button / Message |
| 价格导航 | `PriceNavigator` | Menu / Icon |
| 侧栏图标 | `SettingsSidebar` | Icon |

## 4. 手写主导区域

| 模块 | 代表文件 | 手写重点 |
| --- | --- | --- |
| 首页 | `HeroSection`、`FeatureGrid`、`StatsSection`、`CTASection` | 视频 Hero、滚动 3D 卡片、数字动画 |
| 博客 | `AboutSection`、`BlogList`、`PostsSection`、`SkillsSection` | 编辑风版式、时间线、标签云 |
| 画廊 | `StoryPage`、`GalleryLightbox` | 图片网格、全屏灯箱、键盘导航 |
| 冥想 | `MeditationPage` | 艺术化卡片、导航胶囊、详情面板 |
| AI 聊天 | `ChatComposer`、`ChatSidebar`、`ChatStream` | 输入区、会话侧栏、流式消息渲染 |
| 全屏菜单 | `MenuPanel` | 自定义遮罩、网格菜单、关闭按钮 |

## 5. 当前明显不一致

- `ProfilePublicProfileSection` 仍使用原生 `input/button`，而同属个人中心的 `ProfileAccountSection` 已使用 Element Plus。
- AI 聊天的输入框、发送按钮、会话侧栏和删除下拉为手写实现，与后台/价格模块交互风格不一致。
- 全屏菜单、画廊灯箱、冥想卡片属于高定制化 UI，适合保留手写，但通用按钮/弹层可以改用 Element Plus 外壳。

## 6. UI 规范

### 优先使用 Element Plus

- 表单、弹窗、表格、菜单、选择器、上传、消息反馈。
- 输入框、按钮、标签、分页、开关、标签页等基础控件。
- 后台管理、账户设置、价格查询、登录注册等工具型界面。

### 保留手写

- 品牌展示：Hero、视频、全屏菜单、画廊灯箱。
- 叙事型版式：博客、冥想、首页编辑风区块。
- 自定义动画：滚动 3D、数字滚动、流式打字效果。

### 强制要求

- 所有颜色、圆角、间距、阴影优先使用设计令牌，禁止硬编码色值。
- Element Plus 主题统一在 `_element-plus.scss` 中覆盖，不在业务组件内散落覆盖。
- 通用 UI 组件如按钮、卡片、弹层若被多个业务复用，封装到 `src/shared/components/`。
- 后续新增界面先判断类型：工具型界面用 Element Plus，品牌/叙事型界面用手写。

## 7. 后续改造优先级

| 优先级 | 改造项 | 建议方案 |
| --- | --- | --- |
| P0 | 公开资料表单 | 原生表单改为 `ElForm/ElInput/ElButton` |
| P0 | AI 输入框与发送按钮 | 改为 `ElInput` + `ElButton` |
| P1 | AI 会话侧栏 | 会话列表/删除下拉改用 `ElMenu`/`ElDropdown` |
| P1 | 冥想导航与卡片 | 改用 `ElButton`/`ElCard`，保留艺术化视觉 |
| P1 | 全屏菜单 | 弹层改用 `ElDrawer`，内容保持自定义网格 |
| P2 | 后台退出按钮 | 统一为 `ElButton` |
| P2 | 画廊灯箱 | 外层弹层考虑 `ElDialog`，内部灯箱交互保留 |
