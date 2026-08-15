import type { UserInfoVO } from '@/shared/types'
import projectImageOne from '@/shared/assets/example/default_avatar.png'

// 默认用户信息，用于未登录状态下的展示
export const EXAMPLE_PUBLIC_PROFILE_DEFAULTS: UserInfoVO = {
  id: 0,
  userCode: '',
  userName: '默认用户A',
  nickname: '默认昵称A',
  email: '123@qq.comA',
  phone: '110A',
  remark: '默认备注A',
  role: 'UserA',
  avatarUrl: projectImageOne as string,
  createTime: '',
}
