<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { ArrowDown, Bell, Expand, Fold, Search } from '@element-plus/icons-vue'
import { ADMIN_MENU_ITEMS } from '@/modules/admin/constants'
import { useAdminDashboard } from '@/modules/admin/composables'

const route = useRoute()
const sidebarCollapsed = ref(false)
const { profileName, profileEmail, profileAvatar, handleLogout } = useAdminDashboard()

const activeMenu = computed(() => ADMIN_MENU_ITEMS.find((item) => item.path === route.path))

const activeTitle = computed(() => activeMenu.value?.label || '管理后台')

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-shell__sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
      <div class="admin-shell__sidebar-main">
        <div class="admin-shell__brand">
          <span class="admin-shell__brand-mark">K</span>
          <span class="admin-shell__brand-text">Kite</span>
        </div>

        <nav class="admin-shell__nav">
          <RouterLink
            v-for="item in ADMIN_MENU_ITEMS"
            :key="item.path"
            :to="item.path"
            class="admin-shell__nav-link"
            :class="{ 'is-active': route.path === item.path }"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span class="admin-shell__nav-label">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>

      <div class="admin-shell__sidebar-footer">
        <div class="admin-shell__profile">
          <el-avatar :size="32" :src="profileAvatar || undefined" class="admin-shell__profile-avatar">
            {{ profileName.slice(0, 1).toUpperCase() }}
          </el-avatar>
          <div class="admin-shell__profile-info">
            <div class="admin-shell__profile-name">{{ profileName }}</div>
            <div v-if="profileEmail" class="admin-shell__profile-email">{{ profileEmail }}</div>
          </div>
          <el-button
            class="admin-shell__collapse-btn"
            link
            :icon="sidebarCollapsed ? Expand : Fold"
            @click="toggleSidebar"
          />
        </div>
      </div>
    </aside>

    <div class="admin-shell__main">
      <header class="admin-shell__header">
        <div class="admin-shell__breadcrumbs">
          <span>首页</span>
          <span>/</span>
          <span class="admin-shell__breadcrumb-current">{{ activeTitle }}</span>
        </div>

        <div class="admin-shell__header-actions">
          <el-input class="admin-shell__search" placeholder="搜索..." :prefix-icon="Search" readonly />

          <el-badge is-dot class="admin-shell__notification">
            <el-button class="admin-shell__icon-btn" :icon="Bell" />
          </el-badge>

          <el-dropdown trigger="click" @command="(cmd: string) => cmd === 'logout' && handleLogout()">
            <div class="admin-shell__header-user">
              <el-avatar :size="32" :src="profileAvatar || undefined">
                {{ profileName.slice(0, 1).toUpperCase() }}
              </el-avatar>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item disabled>{{ profileName }}</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="admin-shell__content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/modules/admin/styles/admin-theme';
</style>
