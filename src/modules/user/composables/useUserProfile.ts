import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { DashboardSectionId, UserInfoVO } from '@/shared/types'
import { EXAMPLE_PUBLIC_PROFILE_DEFAULTS } from '@/shared/constants'
import { getCurrentUser, logout, onAuthChange, setCurrentUser } from '@/core/permission'
import { getUserInfoApi, updateUserInfoApi } from '@/modules/user/api/profile'

export function useUserProfile() {
  const router = useRouter()
  const currentUser = ref<UserInfoVO | null>(getCurrentUser())
  const activeSectionId = ref<DashboardSectionId>('public')
  let removeAuthListener = () => {}

  const profileName = computed(
    () => currentUser.value?.nickname || currentUser.value?.userName || '个人中心',
  )

  const profileTitleLine = computed(() => {
    const u = currentUser.value
    const truncate = (str: string) => (str.length > 4 ? str.slice(0, 4) + '...' : str)
    const nick = truncate((u?.nickname || '').trim())
    const un = truncate((u?.userName || '').trim())
    if (nick && un) return `${nick} (${un})`
    if (nick) return nick
    if (un) return `(${un})`
    return `${profileName.value} (guest)`
  })

  const profileSidebarSubtitle = '你的个人账户'
  const profileInitial = computed(() => profileName.value.trim().slice(0, 1).toUpperCase() || 'Q')
  const sidebarAvatarUrl = computed(
    () => (currentUser.value?.avatarUrl ?? '').trim() || EXAMPLE_PUBLIC_PROFILE_DEFAULTS.avatarUrl,
  )

  const examplePublic = EXAMPLE_PUBLIC_PROFILE_DEFAULTS

  const publicProfile = computed<UserInfoVO>(() => {
    const u = currentUser.value
    return {
      userName: u?.userName ?? examplePublic.userName,
      nickname: (u?.nickname || u?.userName || '').trim() || examplePublic.nickname,
      email: u?.email ?? examplePublic.email,
      phone: u?.phone ?? examplePublic.phone,
      remark: (u?.remark ?? '').trim() || examplePublic.remark,
      role: u?.role ?? examplePublic.role,
      avatarUrl: (u?.avatarUrl ?? '').trim() || examplePublic.avatarUrl,
      id: u?.id ?? examplePublic.id,
      userCode: u?.userCode ?? examplePublic.userCode,
      createTime: u?.createTime ?? examplePublic.createTime,
    }
  })

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleSavePublicProfile = async (payload: UserInfoVO) => {
    try {
      await updateUserInfoApi({
        userName: payload.userName,
        nickname: payload.nickname,
        phone: payload.phone,
        remark: payload.remark,
      })
      const userInfoResult = await getUserInfoApi()
      if (userInfoResult.code === 200) {
        currentUser.value = userInfoResult.data
        setCurrentUser(userInfoResult.data)
      }
      ElMessage.success('资料已更新')
    } catch (error) {
      ElMessage.error((error as Error).message || '更新失败，请稍后重试')
    }
  }

  const handleAvatarUpdated = async (avatarUrl: string) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, avatarUrl }
      setCurrentUser(currentUser.value)
    }
    try {
      const userInfoResult = await getUserInfoApi()
      if (userInfoResult.code === 200) {
        currentUser.value = userInfoResult.data
        setCurrentUser(userInfoResult.data)
      }
    } catch {
      // 本地已同步头像，后台刷新失败不阻塞
    }
  }

  onMounted(() => {
    removeAuthListener = onAuthChange((user) => {
      currentUser.value = user as UserInfoVO | null
    })
  })

  onBeforeUnmount(() => {
    removeAuthListener()
  })

  return {
    activeSectionId,
    profileTitleLine,
    profileSidebarSubtitle,
    profileInitial,
    sidebarAvatarUrl,
    publicProfile,
    handleLogout,
    handleSavePublicProfile,
    handleAvatarUpdated,
  }
}
