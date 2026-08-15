import request from '@/core/api/request'
import type {
  AddressCreateDTO,
  AddressUpdateDTO,
  AddressVO,
  EmailBindDTO,
  PasswordUpdateDTO,
  Result,
  UserInfoUpdateDTO,
  UserInfoVO,
} from '@/shared/types'

/** 获取当前登录用户信息 — GET /user/info */
export const getUserInfoApi = async (): Promise<Result<UserInfoVO>> => {
  return request.get('/user/info')
}

/** 更新用户信息（用户名/昵称/手机号/备注） — PUT /user/info */
export const updateUserInfoApi = async (data: UserInfoUpdateDTO): Promise<Result<null>> => {
  return request.put('/user/info', data)
}

/** 上传头像（multipart，字段 file） — PUT /user/avatar */
export const updateAvatarApi = async (file: File): Promise<Result<string>> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.put('/user/avatar', formData)
}

/** 绑定新邮箱 — PUT /user/email */
export const bindEmailApi = async (data: EmailBindDTO): Promise<Result<null>> => {
  return request.put('/user/email', data)
}

/** 修改登录密码 — PUT /user/password */
export const updatePasswordApi = async (data: PasswordUpdateDTO): Promise<Result<null>> => {
  return request.put('/user/password', data)
}

/** 获取收货地址列表 — GET /user/addresses */
export const listAddressesApi = async (): Promise<Result<AddressVO[]>> => {
  return request.get('/user/addresses')
}

/** 新增收货地址，返回地址 ID — POST /user/addresses */
export const createAddressApi = async (data: AddressCreateDTO): Promise<Result<number>> => {
  return request.post('/user/addresses', data)
}

/** 获取单个收货地址 — GET /user/addresses/{id} */
export const getAddressApi = async (id: number): Promise<Result<AddressVO>> => {
  return request.get(`/user/addresses/${id}`)
}

/** 更新收货地址 — PUT /user/addresses/{id} */
export const updateAddressApi = async (id: number, data: AddressUpdateDTO): Promise<Result<null>> => {
  return request.put(`/user/addresses/${id}`, data)
}

/** 删除收货地址 — DELETE /user/addresses/{id} */
export const deleteAddressApi = async (id: number): Promise<Result<null>> => {
  return request.delete(`/user/addresses/${id}`)
}

/** 设为默认收货地址 — PUT /user/addresses/{id}/default */
export const setDefaultAddressApi = async (id: number): Promise<Result<null>> => {
  return request.put(`/user/addresses/${id}/default`)
}
