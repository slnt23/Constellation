<script setup lang="ts">
import ProfileAccessibilitySection from '@/modules/user/components/ProfileAccessibilitySection.vue'
import ProfileAccountSection from '@/shared/components/ProfileAccountSection.vue'
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
  <el-container class="profile-workspace">
    <el-aside width="280px" class="profile-sidebar">
      <div class="profile-sidebar__identity">
        <el-avatar :size="44" :src="sidebarAvatarUrl || undefined">{{ profileInitial }}</el-avatar>
        <div class="profile-sidebar__identity-copy">
          <strong>{{ profileTitleLine }}</strong>
          <span>{{ profileSidebarSubtitle }}</span>
        </div>
      </div>

      <el-menu class="profile-sidebar__menu" :default-active="activeSectionId" @select="handleMenuSelect">
        <el-menu-item index="public">
          <el-icon><User /></el-icon>
          <span>公开资料</span>
        </el-menu-item>
        <el-menu-item index="account">
          <el-icon><Setting /></el-icon>
          <span>账户</span>
        </el-menu-item>
      </el-menu>

      <el-button class="profile-sidebar__logout" text type="danger" :icon="SwitchButton" @click="handleLogout">
        退出登录
      </el-button>
    </el-aside>

    <el-main class="profile-content">
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
      <ProfileAccessibilitySection v-else-if="activeSectionId === 'accessibility'"
        :cards="PROFILE_ACCESSIBILITY_CARDS" />
      <!-- 通知/超时提醒依赖后端计划任务，接口完善前暂不接入。 -->
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.profile-workspace {
  width: var(--shell-width);
  min-height: 100vh;
  background: var(--el-bg-color-page);
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  padding: 20px 12px;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
}

.profile-sidebar__identity {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 20px;
}

.profile-sidebar__identity-copy {
  display: grid;
  min-width: 0;

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  strong {
    color: var(--el-text-color-primary);
    font-size: 14px;
  }

  span {
    margin-top: 3px;
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.profile-sidebar__menu {
  flex: 1;
  border-right: 0;
}

.profile-sidebar__logout {
  justify-content: flex-start;
  width: 100%;
}

.profile-content {
  display: grid;
  gap: 22px;
  min-width: 0;
  margin: 24px;
  padding: 24px;
  border-radius: var(--el-border-radius-base);
  background: var(--el-bg-color);
}

@media (max-width: 760px) {
  .profile-workspace {
    display: block;
    width: 100%;
    padding-top: calc(var(--site-header-offset) + var(--site-header-height) + var(--chat-nav-gap));
  }

  .profile-sidebar {
    width: 100% !important;
    border-right: 0;
    border-bottom: 1px solid var(--el-border-color-light);
  }

  .profile-content {
    margin: 16px;
  }
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
