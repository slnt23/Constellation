import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser, logout, onAuthChange } from '@/core/permission'
import type { UserInfoVO } from '@/shared/types'

export function useAdminDashboard() {
  const router = useRouter()
  const currentUser = ref<UserInfoVO | null>(getCurrentUser())
  let removeAuthListener = () => {}

  const profileName = computed(
    () => currentUser.value?.nickname || currentUser.value?.userName || '管理员',
  )

  const handleLogout = () => {
    void logout().then(() => router.push('/'))
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
    currentUser,
    profileName,
    handleLogout,
  }
}
