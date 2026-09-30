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
