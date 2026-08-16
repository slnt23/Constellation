# OWL 后台界面改造计划

状态：**进行中**，Phase 0–3 已启动实施。

## 1. 目标

把 `src/modules/admin` 的后台界面按 Figma 设计稿 `OWL-admin` 改造，只影响后台管理模块，不影响前台品牌型页面、业务 API 和数据流。

## 2. UI 策略结论

采用 **Element Plus + 自有主题覆盖**，不是纯默认 Element Plus，也不是完全手写：

- Element Plus 负责组件结构：菜单、按钮、输入框、表格、分页、弹窗、表单、上传、消息反馈。
- 自有 SCSS 只做设计令牌与视觉覆盖：颜色、圆角、间距、阴影、字体、布局。
- OWL 设计里没有现成 Element Plus 原语的部分（统计卡片、页面头、空状态、侧边栏结构）用少量自有布局组合，但底层仍复用 Element Plus 组件。
- 后台主题作用域限定在 `.admin-shell`，避免覆盖前台品牌 UI。

## 3. 前置条件

Figma 文件可通过 Cursor Figma MCP 读取（`get_metadata` / `get_screenshot` / `get_design_context`）。侧边栏菜单沿用本地 `ADMIN_MENU_ITEMS`，不新增路由与页面。

## 4. 改造范围

### 4.1 允许改动

- `src/modules/admin/`：页面、组件、样式、菜单常量。
- `src/layouts/AdminLayout.vue`：如需去掉后台宽度约束，改为全宽工作区。
- 后台主题 SCSS：放在 `src/modules/admin/styles/` 或 `src/shared/styles/_admin-theme.scss`。
- 路由仅按需调整 meta、标题、权限，不改变现有路径。

### 4.2 禁止改动

- 前台首页、博客、AI、价格、冥想、故事等业务 UI。
- 后台现有 API、类型、composable 的业务逻辑。
- 其他模块的 Feature-first 结构。

## 5. 页面与设计映射

| 路由 | 当前页面 | OWL 设计目标 | 接口情况 |
| --- | --- | --- | --- |
| `/admin/dashboard/overview` | 控制台总览（空状态） | OWL 控制台布局 | 暂无统计接口，保留单个占位 |
| `/admin/dashboard/content` | 内容管理（空状态） | OWL 内容管理页 | 暂无接口，保留单个占位 |
| `/admin/dashboard/users` | 用户 CRUD | OWL 用户管理页 | 已实现，改造 UI |
| `/admin/dashboard/roles` | 角色 CRUD | OWL 角色管理页 | 已实现，改造 UI |
| `/admin/dashboard/spotlight` | 焦点项目 CRUD | OWL 焦点项目管理页 | 已实现，改造 UI |
| `/admin/dashboard/features` | 特性 CRUD | OWL 特性管理页 | 已实现，改造 UI |
| `/admin/dashboard/settings` | 系统设置（空状态） | OWL 设置页 | 暂无接口，保留单个占位 |

## 6. 实施阶段

### Phase 0：设计稿解析

- 获取 Figma 截图或授权。
- 梳理 OWL-admin 的页面清单、布局层级、组件规格、设计令牌。
- 输出设计到现有页面的映射表。

### Phase 1：后台主题与布局骨架

- 新增后台主题 SCSS，覆盖 Element Plus 变量并限定在 `.admin-shell`。
- 改造 `AdminDashboardPage.vue`：侧边栏 + 顶栏 + 内容区，完全按 OWL 布局。
- 侧边栏保持「一个菜单项 = 一个模块」，顶栏放当前模块标题、搜索/操作、用户信息。
- 处理窄屏：侧边栏折叠、表格横向滚动、弹窗自适应。

### Phase 2：CRUD 页面 UI 改造

- 用户、角色、焦点、特性四页复用现有 `api/` 与业务逻辑，只重排页面结构。
- 统一为 OWL 的页面头 + 筛选区 + 表格卡片 + 分页 + 弹窗表单模式。
- 保留现有新增、编辑、删除、启停、重置密码、上传能力。

### Phase 3：无接口页面收敛

- 控制台、内容管理、系统设置按 OWL 风格保留单个空状态，不铺占位卡片。
- 若后续补充统计接口，再按 OWL 的统计卡/图表区实现。

### Phase 4：细节与验证

- 检查按钮、表格行高、空状态、弹窗、消息等细节与设计稿一致。
- 运行 `npm run type-check` 与 `npm run build`。
- 启动开发服务器逐页截图，与 Figma 截图对比后交付。

## 7. 验收标准

- 后台 7 个页面均呈现 OWL-admin 视觉，路径和功能不变。
- 所有通用交互使用 Element Plus 组件，不手写一套平行控件。
- 后台主题不影响前台品牌页面。
- `npm run type-check` 与 `npm run build` 通过。

