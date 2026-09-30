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
