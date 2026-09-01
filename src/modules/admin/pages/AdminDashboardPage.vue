<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ArrowRight, Bell, Search, Setting } from '@element-plus/icons-vue'
import logoFold from '@/shared/assets/logos/project-fold.png'
import logoUnfold from '@/shared/assets/logos/project-unfold.jpg'
import { ADMIN_HOME_MENU_GROUP, ADMIN_MENU_ITEMS, ALL_ADMIN_MENU_ITEMS } from '@/modules/admin/constants'
import { useAdminDashboard } from '@/modules/admin/composables'

const route = useRoute()
const sidebarCollapsed = ref(true)
const homeMenuExpanded = ref(true)
const { profileName, profileEmail, profileAvatar } = useAdminDashboard()

const activeMenu = computed(() => ALL_ADMIN_MENU_ITEMS.find((item) => item.path === route.path))
const homeMenuActive = computed(() => ADMIN_HOME_MENU_GROUP.items.some((item) => item.path === route.path))

const activeTitle = computed(() => activeMenu.value?.label || '管理后台')

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleHomeMenu = () => {
  if (sidebarCollapsed.value) {
    sidebarCollapsed.value = false
    homeMenuExpanded.value = true
    return
  }
  homeMenuExpanded.value = !homeMenuExpanded.value
}

watch(homeMenuActive, (active) => {
  if (active) homeMenuExpanded.value = true
})
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-shell__sidebar" :class="{ 'is-collapsed': sidebarCollapsed }">
      <div class="admin-shell__sidebar-main">
        <button class="admin-shell__brand" type="button" :title="sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
          :aria-label="sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'" @click="toggleSidebar">
          <img :src="sidebarCollapsed ? logoFold : logoUnfold" alt="Kite" class="admin-shell__brand-logo" />
        </button>

        <nav class="admin-shell__nav">
          <RouterLink v-for="item in ADMIN_MENU_ITEMS" :key="item.path" :to="item.path" class="admin-shell__nav-link"
            :class="{ 'is-active': route.path === item.path }">
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span class="admin-shell__nav-label">{{ item.label }}</span>
          </RouterLink>

          <div class="admin-shell__nav-group" :class="{ 'is-active': homeMenuActive, 'is-open': homeMenuExpanded }">
            <button class="admin-shell__nav-link admin-shell__nav-group-trigger" type="button" @click="toggleHomeMenu">
              <el-icon>
                <component :is="ADMIN_HOME_MENU_GROUP.icon" />
              </el-icon>
              <span class="admin-shell__nav-label">{{ ADMIN_HOME_MENU_GROUP.label }}</span>
              <el-icon class="admin-shell__nav-chevron">
                <ArrowRight />
              </el-icon>
            </button>
            <div v-show="homeMenuExpanded && !sidebarCollapsed" class="admin-shell__nav-children">
              <RouterLink v-for="item in ADMIN_HOME_MENU_GROUP.items" :key="item.path" :to="item.path"
                class="admin-shell__nav-link admin-shell__nav-child" :class="{ 'is-active': route.path === item.path }">
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span class="admin-shell__nav-label">{{ item.label }}</span>
              </RouterLink>
            </div>
          </div>
        </nav>
      </div>

      <div class="admin-shell__sidebar-footer">
        <div class="admin-shell__account-row">
          <RouterLink class="admin-shell__profile" to="/profile" title="个人信息">
            <el-avatar :size="36" :src="profileAvatar || undefined" class="admin-shell__profile-avatar">
              {{ profileName.slice(0, 1).toUpperCase() }}
            </el-avatar>
            <div class="admin-shell__profile-info">
              <div class="admin-shell__profile-name">{{ profileName }}</div>
              <div v-if="profileEmail" class="admin-shell__profile-email">{{ profileEmail }}</div>
            </div>
          </RouterLink>
          <RouterLink class="admin-shell__settings-button" to="/admin/dashboard/settings" title="系统设置"
            aria-label="系统设置">
            <el-icon>
              <Setting />
            </el-icon>
          </RouterLink>
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