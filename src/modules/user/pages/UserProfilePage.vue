<script setup lang="ts">
import ProfileAccessibilitySection from '@/modules/user/components/ProfileAccessibilitySection.vue'
import ProfileAccountSection from '@/shared/components/ProfileAccountSection.vue'
import ProfileAppearanceSection from '@/shared/components/ProfileAppearanceSection.vue'
import ProfileNotificationsSection from '@/modules/user/components/ProfileNotificationsSection.vue'
import ProfilePublicProfileSection from '@/modules/user/components/ProfilePublicProfileSection.vue'
import SettingsWorkspaceShell from '@/shared/components/SettingsWorkspaceShell.vue'
import SettingsSidebar from '@/shared/components/SettingsSidebar.vue'
import {
  PROFILE_ACCESSIBILITY_CARDS,
  PROFILE_APPEARANCE_CARDS,
  PROFILE_NOTIFICATION_CARDS,
  PROFILE_SETTINGS_NAV_SECTIONS,
} from '@/modules/user/constants'
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
