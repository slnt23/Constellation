# 前端接口对接与数据规范

本文档沉淀前端对接后端接口时需要遵守的规范，供后续联调和开发参考。接口事实以 `frontend-api.md` 为准。

## 1. 接口对接规范

- 后端基础地址以 `frontend-api.md` 为准，当前默认 `http://127.0.0.1:18080`。
- Vite 开发代理 `/api` 默认指向上述地址，可通过环境变量 `VITE_API_BASE_URL` 覆盖。
- `/api` 前缀已经写在后端 Controller 上，前端 axios `baseURL` 固定为 `/api`，不要在业务路径中重复拼接。
- 统一响应结构为 `Result<T>`，成功 code 为 `200` 或 `201`；分页结构为 `ResultPage<T>`（`currentPage/pageSize/total/totalPage/records`）。
- 所有接口函数必须声明明确的 `Promise<Result<T>>` 返回类型，不允许用 `request<T>` 把结果类型写成裸数据。
- 请求失败统一抛出 `ApiError`，包含 `code`、`message`、`data`、`status`。
- 登录态失效（HTTP 401 或业务码 `401/401001~401004`）由请求层自动清理本地登录态并触发认证变更事件。

## 2. 请求反馈规范

以下为统一反馈约定，新代码按此执行；当前部分调用侧仍保留各自的提示，后续按此规范收敛。

- 提示统一使用 Element Plus：
  - 轻提示用 `ElMessage`（成功/失败/警告）。
  - 破坏性操作先用 `ElMessageBox.confirm` 确认，再执行。
- 请求失败默认由请求层统一弹出 `ElMessage.error(message)`，错误信息优先取后端 `message`；调用侧不要重复弹错误提示。
- 成功提示只对用户主动操作弹出：登录、保存、上传、创建、更新、删除、重置、退出等。
- 页面加载、列表查询、下拉加载等被动请求不弹成功提示，用数据渲染本身作为成功反馈。
- 不需要统一提示的请求可通过 `silentError` 关闭错误弹窗。
- 不走 axios 的请求（如 AI SSE 的 `fetch`）需要在调用侧自行补齐错误提示。

## 3. 示例数据规范

- 前端不允许使用本地示例/mock 数据冒充接口返回。
- 有后端接口的模块必须调用真实 API，不允许保留 `EXAMPLE_*` 兜底数据。
- 无后端接口的区块可以保留纯静态 UI 配置，但不得使用示例命名，也不得伪装成接口数据。
- 注释中的 mock 数据块不保留。
- 价格模块保持纯静态 UI：`PRICE_LOCATION_OPTIONS` 等静态配置暂不接接口，等后端 `/api/location` 可用后再切换为接口数据。

## 4. 模块组织规范

- 接口文件统一放在 `src/api/modules/<domain>.api.ts`。
- 类型统一放在 `src/types/modules/<domain>.type.ts`，并通过 `src/types/index.ts` 统一导出。
- 常量统一放在 `src/constant/modules/`，不允许把接口返回数据写进常量冒充真实数据。
- 商家商品模块当前不做改动，新增/修改时注意避开。

## 5. 提交前验证

- 运行 `npm run type-check`。
- 涉及构建配置或新增依赖时运行 `npm run build`。
