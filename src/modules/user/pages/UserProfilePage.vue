<script setup lang="ts">
import ProfileAccessibilitySection from '@/modules/user/components/ProfileAccessibilitySection.vue'
import ProfileAccountSection from '@/modules/user/components/ProfileAccountSection.vue'
import ProfilePublicProfileSection from '@/modules/user/components/ProfilePublicProfileSection.vue'
import { Setting, SwitchButton, User } from '@element-plus/icons-vue'
import { PROFILE_ACCESSIBILITY_CARDS } from '@/modules/user/constants'
import { useUserProfile } from '@/modules/user/composables'

const {
  activeSectionId,
  profileTitleLine,
  profileSidebarSubtitle,
  profileInitial,
  sidebarAvatarUrl,
  publicProfile,
  handleLogout,
  handleSavePublicProfile,
  handleAvatarUpdated,
} = useUserProfile()

const handleMenuSelect = (id: string) => {
  if (id === 'public' || id === 'account') activeSectionId.value = id
}
</script>

<template>
  <div class="user-shell">
    <el-aside width="260px" class="user-shell__sidebar">
      <div class="user-shell__sidebar-main">
        <div class="user-shell__profile">
          <el-avatar :size="40" :src="sidebarAvatarUrl || undefined">
            {{ profileInitial }}
          </el-avatar>
          <div class="user-shell__profile-info">
            <div class="user-shell__profile-name">{{ profileTitleLine }}</div>
            <div class="user-shell__profile-subtitle">{{ profileSidebarSubtitle }}</div>
          </div>
        </div>

        <el-menu class="user-shell__menu" :default-active="activeSectionId" @select="handleMenuSelect">
          <el-menu-item index="public">
            <el-icon>
              <User />
            </el-icon>
            <span>公开资料</span>
          </el-menu-item>
          <el-menu-item index="account">
            <el-icon>
              <Setting />
            </el-icon>
            <span>账户</span>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="user-shell__sidebar-footer">
        <el-button class="user-shell__logout" text type="danger" :icon="SwitchButton" @click="handleLogout">
          退出登录
        </el-button>
      </div>
    </el-aside>

    <div class="user-shell__main">
      <header class="user-shell__header">
        <div class="user-shell__header-left">
          <h2 class="user-shell__title">个人中心</h2>
        </div>
        <div class="user-shell__header-right">
          <span class="user-shell__status">已登录</span>
          <span class="user-shell__divider">·</span>
          <span class="user-shell__status">资料已同步</span>
        </div>
      </header>

      <main class="user-shell__content">
        <ProfilePublicProfileSection v-if="activeSectionId === 'public'" :profile="publicProfile"
          @save="handleSavePublicProfile" @avatar-updated="handleAvatarUpdated"
          @email-settings="activeSectionId = 'account'" />
        <ProfileAccountSection v-else-if="activeSectionId === 'account'" />
        <ProfileAccessibilitySection v-else-if="activeSectionId === 'accessibility'"
          :cards="PROFILE_ACCESSIBILITY_CARDS" />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/modules/user/styles/user-theme';
</style>