export interface UserInfoUpdateDTO {
  userName?: string
  nickname?: string
  phone?: string
  remark?: string
}

export interface EmailBindDTO {
  newEmail: string
  code: string
}

export interface PasswordUpdateDTO {
  oldPassword?: string
  newPassword: string
}

export interface UserInfoVO {
  id: number
  userCode: string
  userName: string
  nickname: string
  email: string
  phone: string
  remark: string
  role: string
  avatarUrl: string
  createTime: string
}

export interface AddressCreateDTO {
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: boolean
}

export type AddressUpdateDTO = AddressCreateDTO

export interface AddressVO {
  id: number
  receiverName: string
  receiverPhone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault: number
  createTime: string
  updateTime: string
}
