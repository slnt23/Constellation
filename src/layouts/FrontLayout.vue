<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { FRONT_MENU_ITEMS } from '@/shared/constants'
import SiteHeader from '@/shared/components/SiteHeader.vue'
import MenuPanel from '@/shared/components/MenuPanel.vue'
import SiteFooter from '@/shared/components/SiteFooter.vue'
import LoginDialog from '@/shared/components/LoginDialog.vue'

const route = useRoute()
const menuOpen = ref(false)
const showLoginDialog = ref(false)

const isHome = computed(() => route.path === '/')
const isChatRoute = computed(() => route.path === '/ai-ai')
const showFooter = computed(() => isHome.value)

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
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

    <MenuPanel :open="menuOpen" :items="FRONT_MENU_ITEMS" @close="closeMenu" />

    <LoginDialog v-model="showLoginDialog" />
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