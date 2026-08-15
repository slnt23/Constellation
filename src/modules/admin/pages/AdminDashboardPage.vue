<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { ADMIN_MENU_ITEMS } from '@/modules/admin/constants'
import { useAdminDashboard } from '@/modules/admin/composables'

const route = useRoute()
const { profileName, handleLogout } = useAdminDashboard()

const activeTitle = computed(
  () => ADMIN_MENU_ITEMS.find((item) => item.path === route.path)?.label || '管理后台',
)
</script>

<template>
  <el-container style="min-height: 100vh">
    <el-aside width="232px" style="border-right: 1px solid var(--el-border-color-light); background: #ffffff">
      <div style="height: 56px; display: flex; align-items: center; padding: 0 20px">
        <el-text size="large" tag="b">Kite Admin</el-text>
      </div>
      <el-menu :default-active="route.path" router>
        <el-menu-item v-for="item in ADMIN_MENU_ITEMS" :key="item.path" :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--el-border-color-light);
          background: #ffffff;
        "
      >
        <el-text size="large" tag="b">{{ activeTitle }}</el-text>
        <el-space>
          <el-text type="info">{{ profileName }}</el-text>
          <el-button link type="danger" @click="handleLogout">退出登录</el-button>
        </el-space>
      </el-header>

      <el-main style="background: #fafafa">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
