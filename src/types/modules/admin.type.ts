/**
 * 后台管理接口模型
 * 对应 frontend-api.md「后台管理」章节
 */

/** 特性管理请求/响应模型 — FeatureDTO（FeatureVO 字段相同） */
export interface FeatureDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 图标标识 */
  icon: string
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 排序，值越小越靠前 */
  sortOrder: number
}

/** 焦点项目管理请求模型 — SpotlightDTO */
export interface SpotlightDTO {
  /** 主键，新增不传，修改必传 */
  id?: number
  /** 眉题，最大 50 字符 */
  eyebrow: string
  /** 主标题，最大 100 字符 */
  title: string
  /** 描述，最大 500 字符 */
  description?: string
  /** 图片文件，新增必传（multipart 字段 image） */
  image?: File
  /** 排序，0-9999 */
  sortOrder: number
  /** 跳转链接，最大 255 字符 */
  link?: string
  /** 打开方式，如 _blank */
  target?: string
}

/** 新增焦点项目请求模型 — multipart/form-data，image 必传 */
export type SpotlightCreateDTO = Omit<SpotlightDTO, 'id' | 'image'> & { image: File }

/** 更新焦点项目请求模型 — JSON，主键必传 */
export type SpotlightUpdateDTO = Omit<SpotlightDTO, 'id' | 'image'> & { id: number }

/** 后台用户状态：0=正常，1=封禁 */
export type AdminUserStatus = 0 | 1

/** 后台用户分页查询参数 */
export interface AdminUserQuery {
  /** 页码 */
  pageNum?: number
  /** 每页条数，超过 100 会被后端限制为 100 */
  pageSize?: number
  /** 模糊匹配用户名、昵称、手机号、邮箱 */
  keyword?: string
  /** 0=正常，1=封禁 */
  status?: AdminUserStatus
  /** 精确匹配角色名 */
  roleName?: string
}

/** 后台用户视图对象 — AdminUserVO */
export interface AdminUserVO {
  /** 用户 ID */
  id: number
  /** 账号编号 */
  userCode: string
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 角色名 */
  roleName: string
  /** 0=正常，1=封禁 */
  status: AdminUserStatus
  /** 头像 URL */
  avatarUrl: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 后台新增用户请求体 — UserCreateDTO */
export interface UserCreateDTO {
  /** 用户名，最大 50 字符，唯一 */
  username: string
  /** 邮箱，最大 50 字符，唯一 */
  email: string
  /** 手机号，最大 20 字符 */
  phone?: string
  /** 密码，8-64 位且含字母和数字 */
  password: string
  /** 昵称，最大 50 字符 */
  nickname?: string
  /** 角色名，必须是已启用角色 */
  roleName: string
  /** 0=正常，1=封禁，默认 0 */
  status?: AdminUserStatus
  /** 备注，最大 255 字符 */
  remark?: string
}

/** 后台更新用户请求体 — UserUpdateDTO，只传需要修改的字段 */
export interface UserUpdateDTO {
  username?: string
  email?: string
  phone?: string
  nickname?: string
  roleName?: string
  status?: AdminUserStatus
  remark?: string
}

/** 后台重置密码请求体 — UserPasswordResetDTO */
export interface UserPasswordResetDTO {
  /** 新密码，8-64 位且含字母和数字 */
  newPassword: string
}

/** 后台角色视图对象 — RoleVO */
export interface RoleVO {
  /** 角色 ID */
  id: number
  /** 角色名，最大 100 字符，唯一 */
  roleName: string
  /** 角色描述 */
  description: string
  /** 是否启用 */
  enabled: boolean
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}

/** 后台新增角色请求体 — RoleCreateDTO */
export interface RoleCreateDTO {
  /** 角色名，最大 100 字符，唯一 */
  roleName: string
  /** 描述，最大 255 字符 */
  description?: string
  /** 是否启用，默认 true */
  enabled?: boolean
}

/** 后台更新角色请求体 — RoleUpdateDTO */
export interface RoleUpdateDTO {
  roleName?: string
  description?: string
  enabled?: boolean
}
