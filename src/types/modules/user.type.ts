
/**
 * 用户中心接口模型
 * 对应 frontend-api.md「用户中心」章节
 */

/** 发送验证码请求体 — SendCodeDTO */
export interface SendCodeDTO {
  /** 邮箱地址 */
  email: string
}

/** @deprecated 请使用 SendCodeDTO */
export type SendCodeParams = SendCodeDTO

/** 邮箱验证码登录请求体 — EmailLoginDTO（未注册邮箱登录时自动注册） */
export interface EmailLoginDTO {
  /** 邮箱地址 */
  email: string
  /** 6 位数字验证码 */
  code: string
}

/** 密码登录请求体 — PasswordLoginDTO */
export interface PasswordLoginDTO {
  /** 邮箱地址 */
  email: string
  /** 登录密码 */
  password: string
}

/** 重置密码请求体 — ResetPasswordDTO */
export interface ResetPasswordDTO {
  /** 邮箱地址 */
  email: string
  /** 6 位数字验证码 */
  code: string
  /** 新密码，8-64 位，需同时包含字母和数字 */
  newPassword: string
}

/**
 * 登录/注册表单模型（仅前端表单使用）
 * @deprecated 接口层请使用 EmailLoginDTO / PasswordLoginDTO
 */
export interface LoginOrRegisterParams {
  email: string
  code?: string
  password?: string
  role: string // 'USER' 或 'ADMIN'，数据库中使用的枚举值
}

/** 更新用户信息请求体 — UserInfoUpdateDTO */
export interface UserInfoUpdateDTO {
  /** 用户名，最大 50 字符 */
  userName?: string
  /** 昵称，最大 50 字符 */
  nickname?: string
  /** 手机号，需符合手机号格式 */
  phone?: string
  /** 备注，最大 255 字符 */
  remark?: string
}

/** 绑定新邮箱请求体 — EmailBindDTO */
export interface EmailBindDTO {
  /** 新邮箱地址 */
  newEmail: string
  /** 发送到新邮箱的验证码 */
  code: string
}

/** 修改密码请求体 — PasswordUpdateDTO */
export interface PasswordUpdateDTO {
  /** 旧密码，账号未设置密码时可省略 */
  oldPassword?: string
  /** 新密码，规则同重置密码 */
  newPassword: string
}

/** 当前登录用户信息 — UserInfoVO */
export interface UserInfoVO {
  /** 用户 ID */
  id: number
  /** 账号编号 */
  userCode: string
  /** 用户名 */
  userName: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 备注 */
  remark: string
  /** 角色名 */
  role: string
  /** 头像 URL */
  avatarUrl: string
  /** 创建时间 */
  createTime: string
}

/** 新增地址请求体 — AddressCreateDTO */
export interface AddressCreateDTO {
  /** 收件人姓名，最大 50 字符 */
  receiverName: string
  /** 收件人电话 */
  receiverPhone: string
  /** 省 */
  province: string
  /** 市 */
  city: string
  /** 区/县 */
  district: string
  /** 详细地址，最大 255 字符 */
  detail: string
  /** 是否默认地址 */
  isDefault?: boolean
}

/** 更新地址请求体 — AddressUpdateDTO（字段同 AddressCreateDTO） */
export type AddressUpdateDTO = AddressCreateDTO

/** 收货地址视图对象 — AddressVO */
export interface AddressVO {
  /** 地址 ID */
  id: number
  /** 收件人姓名 */
  receiverName: string
  /** 收件人电话 */
  receiverPhone: string
  /** 省 */
  province: string
  /** 市 */
  city: string
  /** 区/县 */
  district: string
  /** 详细地址 */
  detail: string
  /** 1=是，0=否 */
  isDefault: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
}
