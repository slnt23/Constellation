<script setup lang="ts">
/**
 * 用户个人中心页面组件
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 导入个人中心各功能区块组件
import ProfileAccessibilitySection from '@/components/dashboard/ProfileAccessibilitySection.vue' // 辅助功能设置
import ProfileAccountSection from '@/components/dashboard/ProfileAccountSection.vue' // 账户信息管理
import ProfileAppearanceSection from '@/components/dashboard/ProfileAppearanceSection.vue' // 外观设置
import ProfileNotificationsSection from '@/components/dashboard/ProfileNotificationsSection.vue' // 通知设置
import ProfilePublicProfileSection from '@/components/dashboard/ProfilePublicProfileSection.vue' // 公开资料编辑

// 导入布局组件
import SettingsWorkspaceShell from '@/components/dashboard/SettingsWorkspaceShell.vue' // 整体布局容器
import SettingsSidebar from '@/components/dashboard/SettingsSidebar.vue' // 侧边导航栏

// 导入类型定义
import type { DashboardSectionId, UserInfoVO } from '@/types'

// 导入常量配置
import {
  EXAMPLE_PUBLIC_PROFILE_DEFAULTS,
  PROFILE_ACCESSIBILITY_CARDS,
  PROFILE_APPEARANCE_CARDS,
  PROFILE_NOTIFICATION_CARDS,
  // PROFILE_SECTION_ITEMS,
  PROFILE_SETTINGS_NAV_SECTIONS,
} from '@/constant'

// 导入认证工具函数
import { getCurrentUser, logout, onAuthChange, setCurrentUser } from '@/utils/auth.ts'
import { getUserInfoApi, updateUserInfoApi } from '@/api'

// 路由实例，用于页面导航
const router = useRouter()

// 响应式数据定义，改为
const currentUser = ref<UserInfoVO | null>(getCurrentUser()) // 当前登录用户信息
const activeSectionId = ref<DashboardSectionId>('public') // 当前激活的功能区块ID，默认为公开资料

// 认证状态监听器清理函数
let removeAuthListener = () => {
}

/**
 * 计算属性：用户显示名称（优先显示昵称，其次用户名）
 */
const profileName = computed(() => currentUser.value?.nickname || currentUser.value?.userName || '个人中心')

// 侧边栏标题行显示逻辑,显示规则：昵称(用户名) > 昵称 > (用户名) > 默认名称(guest)
const profileTitleLine = computed(() => {
  const u = currentUser.value
  const truncate = (str: string) => str.length > 4 ? str.slice(0, 4) + '...' : str
  const nick = truncate((u?.nickname || '').trim())
  const un = truncate((u?.userName || '').trim())
  if (nick && un) return `${nick} (${un})`
  if (nick) return nick
  if (un) return `(${un})`
  return `${profileName.value} (guest)`
})

// 侧边栏副标题
const profileSidebarSubtitle = '你的个人账户'

/**
 * 计算属性：用户名称首字母（用于头像占位符）
 */
const profileInitial = computed(() => profileName.value.trim().slice(0, 1).toUpperCase() || 'Q')

/**
 * 计算属性：侧边栏头像URL（使用用户头像或默认头像）
 */
const sidebarAvatarUrl = computed(
  () => (currentUser.value?.avatarUrl ?? '').trim() || EXAMPLE_PUBLIC_PROFILE_DEFAULTS.avatarUrl,
)

/**
 * 计算属性：当前激活的功能区块配置信息
 */
// const activeSection = computed(
//   () => PROFILE_SECTION_ITEMS.find((item) => item.id === activeSectionId.value) || PROFILE_SECTION_ITEMS[0],
// )

// 公开资料默认值常量
const examplePublic = EXAMPLE_PUBLIC_PROFILE_DEFAULTS

/**
 * 计算属性：可编辑的公开资料表单数据
 * 将用户数据与默认值合并，确保表单有合理的初始值
 */
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

/**
 * 组件挂载时设置认证状态监听
 * 当用户登录状态变化时更新当前用户数据
 */
onMounted(() => {
  removeAuthListener = onAuthChange((user) => {
    currentUser.value = user as UserInfoVO | null
  })
})

/**
 * 组件卸载前清理认证监听器
 * 防止内存泄漏
 */
onBeforeUnmount(() => {
  removeAuthListener()
})

</script>

<template>
  <!-- 个人中心整体布局容器 -->
  <SettingsWorkspaceShell>
    <template #sidebar>
      <!-- 侧边栏 -->
      <SettingsSidebar v-model="activeSectionId" :sections="PROFILE_SETTINGS_NAV_SECTIONS"
        :title-line="profileTitleLine" :subtitle-line="profileSidebarSubtitle" :avatar-url="sidebarAvatarUrl"
        :avatar-initial="profileInitial">
        <template #footer>
          <button type="button" class="profile-logout" @click="handleLogout">退出登录</button>
        </template>
      </SettingsSidebar>
    </template>

    <!-- 主内容区域 -->
    <div class="profile-content">
      <header class="profile-content__header">
        <div class="profile-content__header-main">
          <div>
            <p class="eyebrow-label">个人中心</p>
          </div>
          <div class="profile-content__meta">
            <span>已登录</span>
            <span class="dot"></span>
            <span>资料已同步</span>
          </div>
        </div>
      </header>

      <!-- 动态内容区块：根据激活的区块ID显示对应组件 -->
      <ProfilePublicProfileSection v-if="activeSectionId === 'public'" :profile="publicProfile"
        @save="handleSavePublicProfile" @avatar-updated="handleAvatarUpdated"
        @email-settings="activeSectionId = 'account'" />
      <ProfileAccountSection v-else-if="activeSectionId === 'account'" />
      <ProfileAppearanceSection v-else-if="activeSectionId === 'appearance'" :cards="PROFILE_APPEARANCE_CARDS" />
      <ProfileAccessibilitySection v-else-if="activeSectionId === 'accessibility'"
        :cards="PROFILE_ACCESSIBILITY_CARDS" />
      <ProfileNotificationsSection v-else :cards="PROFILE_NOTIFICATION_CARDS" />
    </div>
  </SettingsWorkspaceShell>
</template>

<style scoped lang="scss">
.profile-logout {
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  color: #cf222e;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #ffebe9;
  }
}

.profile-content {
  display: grid;
  gap: 22px;
  min-width: 0;
}

.profile-content__header-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-content__meta {
  display: flex;
  align-items: center;
  gap: 10px;

  font-size: 13px;
  color: #909399;
}

.profile-content__meta .dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #c0c4cc;
}
</style>
