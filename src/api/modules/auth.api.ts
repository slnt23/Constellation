import request from '../request/index'
import type { EmailLoginDTO, PasswordLoginDTO, ResetPasswordDTO, Result, SendCodeDTO } from '@/types'

/** 发送邮箱验证码 — POST /auth/send-code */
export const sendCodeApi = async (data: SendCodeDTO): Promise<Result<null>> => {
  return request.post('/auth/send-code', data)
}

/** 邮箱验证码登录（未注册邮箱登录时自动注册） — POST /auth/login-email */
export const loginMailApi = async (data: EmailLoginDTO): Promise<Result<string>> => {
  return request.post('/auth/login-email', data)
}

/** 密码登录 — POST /auth/login-password */
export const loginPasswordApi = async (data: PasswordLoginDTO): Promise<Result<string>> => {
  return request.post('/auth/login-password', data)
}

/**
 * 注册（兼容旧调用）
 * 后端文档没有独立注册接口，邮箱验证码登录会自动注册，因此统一走 login-email。
 * @deprecated 请改用 loginMailApi
 */
export const registerApi = async (data: EmailLoginDTO): Promise<Result<string>> => {
  return request.post('/auth/login-email', data)
}

/** 重置密码 — POST /auth/password/reset */
export const resetPasswordApi = async (data: ResetPasswordDTO): Promise<Result<null>> => {
  return request.post('/auth/password/reset', data)
}

/** 退出登录 — POST /auth/logout */
export const logoutApi = async (): Promise<Result<null>> => {
  return request.post('/auth/logout')
}
