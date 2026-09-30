import request from '@/core/api/request'
import type { EmailLoginDTO, PasswordLoginDTO, ResetPasswordDTO, SendCodeDTO } from '@/modules/user/types'
import type { Result } from '@/shared/types'

/** 发送邮箱验证码 — POST /auth/send-code */
export const sendCodeApi = async (data: SendCodeDTO): Promise<Result<string>> => {
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

/** 重置密码 — POST /auth/password/reset */
export const resetPasswordApi = async (data: ResetPasswordDTO): Promise<Result<null>> => {
  return request.post('/auth/password/reset', data)
}

/** 退出登录 — POST /auth/logout */
export const logoutApi = async (): Promise<Result<null>> => {
  return request.post('/auth/logout')
}
