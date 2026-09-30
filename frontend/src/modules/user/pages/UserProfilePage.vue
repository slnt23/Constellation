<script setup lang="ts">
import ProfileAccessibilitySection from '@/modules/user/components/ProfileAccessibilitySection.vue'
import ProfileAccountSection from '@/modules/user/components/ProfileAccountSection.vue'
import ProfilePublicProfileSection from '@/modules/user/components/ProfilePublicProfileSection.vue'
import GalleryManageSection from '@/modules/user/components/GalleryManageSection.vue'
import BlogManageSection from '@/modules/user/components/BlogManageSection.vue'
import BlogSettingsSection from '@/modules/user/components/BlogSettingsSection.vue'
import { ArrowRight, Setting, SwitchButton, User, Picture, Document } from '@element-plus/icons-vue'
import { PROFILE_ACCESSIBILITY_CARDS } from '@/modules/user/constants'
import { useUserProfile } from '@/modules/user/composables'
import { ref, watch } from 'vue'

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

const blogMenuExpanded = ref(false)

const handleMenuSelect = (id: string) => {
  if (id === 'public' || id === 'account' || id === 'gallery' || id === 'blog' || id === 'blog-settings') {
    activeSectionId.value = id
  }
}

const toggleBlogMenu = () => {
  blogMenuExpanded.value = !blogMenuExpanded.value
}

watch(activeSectionId, (val) => {
  if (val === 'blog' || val === 'blog-settings') {
    blogMenuExpanded.value = true
  }
})
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
          <el-menu-item index="gallery">
            <el-icon>
              <Picture />
            </el-icon>
            <span>画廊管理</span>
          </el-menu-item>

          <div class="user-shell__menu-group" :class="{ 'is-open': blogMenuExpanded }">
            <div class="user-shell__menu-group-trigger" @click="toggleBlogMenu">
              <el-icon>
                <Document />
              </el-icon>
              <span>博客管理</span>
              <el-icon class="user-shell__menu-chevron">
                <ArrowRight />
              </el-icon>
            </div>
            <div v-show="blogMenuExpanded" class="user-shell__menu-children">
              <el-menu-item index="blog" class="user-shell__menu-child">
                <span>博客内容</span>
              </el-menu-item>
              <el-menu-item index="blog-settings" class="user-shell__menu-child">
                <span>博客设置</span>
              </el-menu-item>
            </div>
          </div>
        </el-menu>
      </div>

      <div class="user-shell__sidebar-footer">
        <div class="user-shell__account-item" :class="{ 'is-active': activeSectionId === 'account' }"
          @click="handleMenuSelect('account')">
          <el-icon>
            <Setting />
          </el-icon>
          <span>账户</span>
        </div>
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
        <GalleryManageSection v-else-if="activeSectionId === 'gallery'" />
        <BlogManageSection v-else-if="activeSectionId === 'blog'" />
        <BlogSettingsSection v-else-if="activeSectionId === 'blog-settings'" />
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