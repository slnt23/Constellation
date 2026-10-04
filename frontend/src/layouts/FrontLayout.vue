<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { isAuthenticated } from '@/core/permission'
import { useFrontMenu } from '@/shared/composables/useFrontMenu'
import SiteHeader from '@/shared/components/SiteHeader.vue'
import MenuPanel from '@/shared/components/MenuPanel.vue'
import SiteFooter from '@/shared/components/SiteFooter.vue'
import LoginPanel from '@/shared/components/LoginPanel.vue'

const route = useRoute()
const menuOpen = ref(false)
const showLoginDialog = ref(false)

// 菜单内容来自后台，配图是 MinIO 预签名 URL，不再打包进产物
const { items: menuItems, loadMenu } = useFrontMenu()

const isHome = computed(() => route.path === '/')
const isChatRoute = computed(() => route.path === '/ai-ai')
const showFooter = computed(() => isHome.value)

const toggleMenu = async () => {
  if (!isAuthenticated()) {
    try {
      await ElMessageBox.confirm(
        '登录后即可使用菜单功能，是否前往登录？',
        '提示',
        {
          confirmButtonText: '去登录',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
      showLoginDialog.value = true
    } catch {
      // 用户点击取消，不做任何操作
    }
    return
  }
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    // 打开时拉取，保证菜单总是最新的；未登录用户不会走到这里，不会产生多余请求
    loadMenu()
  }
}
const closeMenu = () => { menuOpen.value = false }
const openLogin = () => { showLoginDialog.value = true }
</script>

<template>
  <div class="site-shell" :class="{ 'site-shell--menu-open': menuOpen, 'site-shell--chat': isChatRoute }">
    <SiteHeader :is-home="isHome" @toggle-menu="toggleMenu" @open-login="openLogin" @close-menu="closeMenu" />

    <main class="site-main">
      <RouterView />
    </main>

    <SiteFooter v-if="showFooter" />

    <MenuPanel :open="menuOpen" :items="menuItems" @close="closeMenu" />

    <LoginPanel v-model="showLoginDialog" />
  </div>
</template>

<style scoped lang="scss">
.site-shell {
  position: relative;
  margin: 0 auto;

  &--chat {
    width: 100%;
    max-width: none;
    padding-bottom: 0;
  }
}

.site-main {
  width: 100%;
}

@media (max-width: 760px) {
  .site-shell {
    width: var(--shell-width-mobile);
  }
}
</style>