# 博客模块 API 联调文档

> 后端实现版本，供前端联调参考。原 mango 模块已融合至 user 模块，接口路径前缀统一为 `/blog`。

---

## 目录

1. [博客文章接口](#1-博客文章接口)
2. [博客设置接口](#2-博客设置接口)
3. [统一响应格式](#3-统一响应格式)
4. [认证说明](#4-认证说明)
5. [注意事项](#5-注意事项)

---

## 1. 博客文章接口

> 基础路径：`/blog`

### 1.1 数据结构

#### BlogPostVO（响应）

| 字段       | 类型             | 说明                   |
| ---------- | ---------------- | ---------------------- |
| id         | number           | 文章 ID                |
| title      | string           | 文章标题               |
| excerpt    | string           | 文章摘要               |
| content    | string           | 文章正文（Markdown）   |
| coverUrl   | string           | 封面图片 URL           |
| tags       | string[]         | 标签数组               |
| status     | number           | 状态：0=草稿，1=已发布 |
| sortOrder  | number           | 排序权重（越大越靠前） |
| createTime | string (ISO8601) | 创建时间               |
| updateTime | string (ISO8601) | 更新时间               |

#### BlogPostCreateDTO（创建请求）

| 字段      | 类型   | 必填 | 说明                                          |
| --------- | ------ | ---- | --------------------------------------------- |
| title     | string | ✅   | 文章标题，最大 255 字符                       |
| excerpt   | string | ❌   | 文章摘要，最大 500 字符                       |
| content   | string | ✅   | 文章正文（Markdown）                          |
| cover     | File   | ❌   | 封面图片（multipart/form-data）               |
| tags      | string | ❌   | 标签，JSON 字符串格式，如 `["标签1","标签2"]` |
| sortOrder | number | ❌   | 排序权重，默认 0                              |

> ⚠️ **注意**：创建时 `status` 固定为 `0`（草稿），发布功能后续通过更新接口控制。

#### BlogPostUpdateDTO（更新请求）

| 字段      | 类型   | 必填 | 说明                  |
| --------- | ------ | ---- | --------------------- |
| title     | string | ❌   | 文章标题              |
| excerpt   | string | ❌   | 文章摘要              |
| content   | string | ❌   | 文章正文              |
| cover     | File   | ❌   | 封面图片              |
| tags      | string | ❌   | 标签，JSON 字符串格式 |
| sortOrder | number | ❌   | 排序权重              |

> 仅更新传入的非空字段，未传入字段保持不变。

---

### 1.2 接口列表

#### 1.2.1 获取我的博客列表（全部）

```
GET /blog
```

- **认证**：需要登录
- **说明**：返回当前用户的所有博客文章（含草稿和已发布），按 `sortOrder` 降序、`createTime` 降序排列

**响应示例**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "excerpt": "文章摘要",
      "content": "正文内容",
      "coverUrl": "https://...",
      "tags": ["标签1", "标签2"],
      "status": 1,
      "sortOrder": 0,
      "createTime": "2026-09-02T10:00:00",
      "updateTime": "2026-09-02T10:00:00"
    }
  ]
}
```

---

#### 1.2.2 分页获取我的博客列表

```
GET /blog/page?pageNum=1&pageSize=10
```

- **认证**：需要登录
- **说明**：分页返回当前用户的博客文章

| 参数     | 类型   | 必填 | 默认值 | 说明                       |
| -------- | ------ | ---- | ------ | -------------------------- |
| pageNum  | number | ❌   | 1      | 页码，从 1 开始            |
| pageSize | number | ❌   | 10     | 每页条数，最大 50，最小 10 |

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "currentPage": 1,
    "pageSize": 10,
    "total": 85,
    "totalPage": 9,
    "records": [
      {
        "id": 1,
        "title": "文章标题",
        "excerpt": "文章摘要",
        "content": "正文内容",
        "coverUrl": "https://...",
        "tags": ["标签1", "标签2"],
        "status": 1,
        "sortOrder": 0,
        "createTime": "2026-09-02T10:00:00",
        "updateTime": "2026-09-02T10:00:00"
      }
    ]
  }
}
```

---

#### 1.2.3 分页获取全部博客列表（公开）

```
GET /blog/all/page?pageNum=1&pageSize=10
```

- **认证**：不需要登录
- **说明**：分页返回所有用户已发布的博客文章（status=1）

| 参数     | 类型   | 必填 | 默认值 | 说明     |
| -------- | ------ | ---- | ------ | -------- |
| pageNum  | number | ❌   | 1      | 页码     |
| pageSize | number | ❌   | 10     | 每页条数 |

**响应**：同上，分页结构

---

#### 1.2.4 获取博客详情

```
GET /blog/{id}
```

- **认证**：需要登录（查看自己的草稿）或 无需登录（查看已发布的公开文章）
- **说明**：草稿仅作者本人可见，已发布文章所有人可见

**响应**：同 BlogPostVO 结构

---

#### 1.2.5 创建博客文章

```
POST /blog
Content-Type: multipart/form-data
```

- **认证**：需要登录
- **说明**：创建后状态为草稿（status=0）

**请求体（FormData）**：

| 字段      | 类型   | 必填 | 说明             |
| --------- | ------ | ---- | ---------------- |
| title     | string | ✅   | 文章标题         |
| excerpt   | string | ❌   | 文章摘要         |
| content   | string | ✅   | 文章正文         |
| cover     | File   | ❌   | 封面图片文件     |
| tags      | string | ❌   | JSON 字符串数组  |
| sortOrder | number | ❌   | 排序权重，默认 0 |

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

> `data` 为新创建的文章 ID

---

#### 1.2.6 更新博客文章

```
PUT /blog/{id}
Content-Type: multipart/form-data
```

- **认证**：需要登录
- **说明**：仅文章作者可更新，未传入字段保持不变

**请求体（FormData）**：字段同创建接口，全部可选

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

---

#### 1.2.7 删除博客文章

```
DELETE /blog/{id}
```

- **认证**：需要登录
- **说明**：仅文章作者可删除，逻辑删除（`deleted` 标记为 1）

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

---

## 2. 博客设置接口

> 基础路径：`/blog/settings`

### 2.1 数据结构

#### BlogSettingsVO（响应）

```typescript
{
  about: {
    tagLine: string;       // 标签行
    bio: string[];         // 个人简介段落数组
    location: string;      // 位置信息
    githubUrl: string;     // GitHub 链接
    codetimeUrl: string;   // CodeTime Badge URL
    poem: string;          // 诗句/座右铭
  };
  educations: [{
    school: string;        // 学校名称
    degree: string;        // 学位/专业
    period: string;        // 时间段
  }];
  skills: [{
    category: string;      // 分类名称（如 Web、Programming）
    items: string[];       // 技能项列表
  }];
}
```

#### BlogSettingsDTO（更新请求）

- 结构与响应完全一致，所有字段均为可选
- 更新策略：**整体替换** — 传入 `educations` 会先删除旧数据再写入新数据；传入 `skills` 同理

---

### 2.2 接口列表

#### 2.2.1 获取博客设置

```
GET /blog/settings
```

- **认证**：需要登录
- **说明**：返回当前用户的完整博客设置（about + 教育经历 + 技能）

**响应示例**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "about": {
      "tagLine": "Developer / Designer / <del>Medical student</del>",
      "bio": ["你好，我是 Arthals，一个兴趣使然、热爱编程的医学生。", "目前就读于北京大学医学部..."],
      "location": "China / Beijing",
      "githubUrl": "https://github.com",
      "codetimeUrl": "https://shields.jannchie.com/endpoint?...",
      "poem": "春潮带雨晚来急，野渡无人舟自横。"
    },
    "educations": [
      {
        "school": "北京大学",
        "degree": "预防医学 & 计算机科学技术双学位",
        "period": "August 2021 - Present"
      }
    ],
    "skills": [
      {
        "category": "Web",
        "items": ["Vue.js", "Nuxt.js", "Node.js", "React.js"]
      }
    ]
  }
}
```

---

#### 2.2.2 更新博客设置

```
PUT /blog/settings
Content-Type: application/json
```

- **认证**：需要登录
- **说明**：整体更新设置，可部分传入（只传 `about` 则只更新 about，不传 `educations` 则保持原样不动）

**请求体**：

```json
{
  "about": {
    "tagLine": "...",
    "bio": ["段落1", "段落2"],
    "location": "China / Beijing",
    "githubUrl": "https://github.com",
    "codetimeUrl": "https://...",
    "poem": "..."
  },
  "educations": [
    {
      "school": "北京大学",
      "degree": "预防医学",
      "period": "2021 - Present",
      "sortOrder": 0
    }
  ],
  "skills": [
    {
      "category": "Web",
      "items": ["Vue.js", "React.js"],
      "sortOrder": 0
    }
  ]
}
```

**响应**：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

---

## 3. 统一响应格式

所有接口遵循统一的 `Result` 响应格式：

```typescript
// 成功
{
  "code": 200,
  "message": "操作成功",
  "data": T  // 具体数据
}

// 失败
{
  "code": 400 | 401 | 403 | 404 | 500,
  "message": "错误描述",
  "data": null
}
```

**分页响应** `ResultPage<T>`：

```typescript
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "currentPage": number;   // 当前页码
    "pageSize": number;      // 每页条数
    "total": number;         // 总记录数
    "totalPage": number;     // 总页数
    "records": T[];          // 当前页数据
  }
}
```

---

## 4. 认证说明

| 接口                 | 认证要求 | 说明                           |
| -------------------- | -------- | ------------------------------ |
| `GET /blog`          | 需要登录 | 返回当前用户自己的文章         |
| `GET /blog/page`     | 需要登录 | 分页返回自己的文章             |
| `GET /blog/all/page` | 无需登录 | 公开接口，返回所有已发布文章   |
| `GET /blog/{id}`     | 视情况   | 草稿需登录且为作者，已发布公开 |
| `POST /blog`         | 需要登录 | 创建文章                       |
| `PUT /blog/{id}`     | 需要登录 | 仅作者可更新                   |
| `DELETE /blog/{id}`  | 需要登录 | 仅作者可删除                   |
| `GET /blog/settings` | 需要登录 | 返回自己的设置                 |
| `PUT /blog/settings` | 需要登录 | 更新自己的设置                 |

认证方式：通过请求头携带 Token（现有的认证机制不变）。

---

## 5. 注意事项

1. **tags 字段**：创建/更新时 `tags` 传 JSON 字符串格式 `["标签1","标签2"]`，响应中 `tags` 为 `string[]` 数组
2. **cover 上传**：创建/更新接口使用 `multipart/form-data`，`cover` 字段传文件，后端自动上传到 MinIO 并返回 URL
3. **status 字段**：创建时固定为 `0`（草稿），目前暂不提供发布接口。可以后续在更新接口中增加 `status` 字段支持切换
4. **sortOrder**：排序权重，数值越大越靠前，默认 0
5. **删除**：使用逻辑删除（`deleted=1`），不会物理删除数据
6. **设置更新**：`about` 为增量更新（只更新传入字段），`educations` 和 `skills` 为整体替换（先删后写）
7. **接口路径**：所有博客接口路径前缀为 `/blog`，与旧 mango 模块的 `/api/blog/...` 不同
