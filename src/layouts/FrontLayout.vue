<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { getCurrentUser, onAuthChange } from '@/core/permission'
import {
  FRONT_MENU_ITEMS
} from '@/shared/constants'
import MenuPanel from '@/shared/components/MenuPanel.vue'
import SiteFooter from '@/shared/components/SiteFooter.vue'
import LoginDialog from '@/shared/components/LoginDialog.vue'


const route = useRoute()
const menuOpen = ref(false)
const isScrolled = ref(false)
const isHeaderVisible = ref(false)
const isHeaderPinned = ref(false)
const isHeaderForcedHidden = ref(true)
const currentUser = ref(getCurrentUser())
const showLoginDialog = ref(false)
let removeAuthListener = () => { }
let lastScrollY = 0
let lastShiftPressAt = 0
let pinnedHideTimer = 0
let scrollRafPending = false
let lastRefreshTs = 0

const shiftDoublePressGap = 360
const pinnedHeaderDuration = 5000
const scrollRevealThreshold = 12
const isHome = computed(() => route.path === '/')
const isChatRoute = computed(() => route.path === '/ai-ai')
const showCompactHeader = computed(() => !isHome.value || isScrolled.value)
const showFooter = computed(() => isHome.value)

const accountRoute = computed(() => (currentUser.value ? '/profile' : '/login'))
const accountLabel = computed(() => (currentUser.value ? '我的' : '登录'))

const clearPinnedHideTimer = () => {
  if (pinnedHideTimer) {
    window.clearTimeout(pinnedHideTimer)
    pinnedHideTimer = 0
  }
}

const releasePinnedHeader = () => {
  clearPinnedHideTimer()
  isHeaderPinned.value = false

  if (!menuOpen.value && !showLoginDialog.value) {
    isHeaderVisible.value = false
  }
}

const schedulePinnedHeaderHide = () => {
  clearPinnedHideTimer()
  pinnedHideTimer = window.setTimeout(() => {
    releasePinnedHeader()
  }, pinnedHeaderDuration)
}

const showHeaderTemporarily = () => {
  isHeaderForcedHidden.value = false
  isHeaderPinned.value = true
  isHeaderVisible.value = true
  schedulePinnedHeaderHide()
}

const hideHeader = () => {
  clearPinnedHideTimer()
  isHeaderPinned.value = false
  isHeaderForcedHidden.value = true
  isHeaderVisible.value = false
}

const syncScrollState = () => {
  if (scrollRafPending) return
  scrollRafPending = true
  requestAnimationFrame(() => {
    scrollRafPending = false

    const currentScrollY = window.scrollY
    const scrollDelta = currentScrollY - lastScrollY

    isScrolled.value = currentScrollY > window.innerHeight * 0.28

    if (isHeaderForcedHidden.value) {
      isHeaderVisible.value = false
    } else if (menuOpen.value || showLoginDialog.value || isHeaderPinned.value) {
      isHeaderVisible.value = true
    } else if (currentScrollY <= 24) {
      isHeaderVisible.value = false
    } else if (scrollDelta > scrollRevealThreshold) {
      isHeaderVisible.value = false
    } else if (scrollDelta < -scrollRevealThreshold) {
      isHeaderVisible.value = true
    }

    lastScrollY = currentScrollY
  })
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleKeydown = (event) => {
  if (event.shiftKey && !event.repeat && event.key.toLowerCase() === 'q') {
    hideHeader()
    lastShiftPressAt = 0
    return
  }

  if (event.key !== 'Shift' || event.repeat) {
    return
  }

  const now = Date.now()
  if (now - lastShiftPressAt <= shiftDoublePressGap) {
    showHeaderTemporarily()
    lastShiftPressAt = 0
    return
  }

  lastShiftPressAt = now
}

const refreshPinnedHeader = () => {
  if (!isHeaderPinned.value) return
  const now = Date.now()
  if (now - lastRefreshTs < 200) return
  lastRefreshTs = now
  schedulePinnedHeaderHide()
}

const onOverlayOpenChange = (open) => {
  if (open) {
    isHeaderForcedHidden.value = false
    isHeaderVisible.value = true
    return
  }
  lastScrollY = window.scrollY
}

watch(
  () => route.path,
  () => {
    closeMenu()
    hideHeader()
    window.requestAnimationFrame(() => {
      lastScrollY = window.scrollY
      syncScrollState()
    })
  },
)

watch(() => menuOpen.value, onOverlayOpenChange)

watch(() => showLoginDialog.value, onOverlayOpenChange)

onMounted(() => {
  lastScrollY = window.scrollY
  syncScrollState()
  removeAuthListener = onAuthChange((user) => {
    currentUser.value = user
  })
  window.addEventListener('scroll', syncScrollState, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', refreshPinnedHeader, { passive: true })
  window.addEventListener('touchstart', refreshPinnedHeader, { passive: true })

})

onBeforeUnmount(() => {
  clearPinnedHideTimer()
  removeAuthListener()
  window.removeEventListener('scroll', syncScrollState)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', refreshPinnedHeader)
  window.removeEventListener('touchstart', refreshPinnedHeader)

})
</script>

<template>
  <div class="site-shell" :class="{ 'site-shell--menu-open': menuOpen, 'site-shell--chat': isChatRoute }">
    <header class="site-header" :class="{
      'site-header--home-top': isHome && !showCompactHeader,
      'site-header--compact': showCompactHeader,
      'site-header--hidden': !isHeaderVisible,
    }">
      <RouterLink class="site-brand" to="/" @click="closeMenu">
        <strong>
      <img class="site-brand__logo" src="@/shared/assets/example/brand_home_header.png" alt="主页" />
        </strong>
        <span class="site-brand__name">主页中心</span>
      </RouterLink>

      <div class="site-header__actions">
        <button class="site-header__button site-header__button--menu" type="button" @click="toggleMenu">
          LET'S MENU
        </button>
        <button v-if="!currentUser" class="site-header__button site-header__button--login" type="button"
          @click="showLoginDialog = true">
          {{ accountLabel }}
        </button>
        <RouterLink v-else class="site-header__button site-header__button--login" :to="accountRoute" @click="closeMenu">
          {{ accountLabel }}
        </RouterLink>
      </div>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <SiteFooter v-if="showFooter" />

    <MenuPanel :open="menuOpen" :items="FRONT_MENU_ITEMS" @close="closeMenu" />

    <LoginDialog v-model="showLoginDialog" />
  </div>
</template>

<style scoped lang="scss">
// 变量定义
$header-transition: 220ms ease;
$button-transition: 180ms ease;
$radius-pill: var(--radius-pill);

// 基础布局
.site-shell {
  position: relative;
  // width: var(--shell-width);
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

// 头部样式
.site-header {
  position: fixed;
  //top: var(--site-header-offset);
  left: 50%;
  z-index: 40;
  width: var(--shell-width);
  transform: translate(-50%, 0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 10px 14px;
  min-height: var(--site-header-height);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: calc(#{$radius-pill} - 2px);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.82), rgba(244, 248, 252, 0.66)),
    rgba(255, 255, 255, 0.55);
  box-shadow:
    0 18px 40px rgba(27, 44, 57, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px) saturate(140%);
  transition: all $header-transition;

  &--hidden {
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, calc(-100% - 18px));
  }

  &--compact {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(240, 246, 251, 0.88)),
      rgba(255, 255, 255, 0.8);
    border-color: rgba(185, 205, 221, 0.68);
    box-shadow:
      0 18px 42px rgba(18, 54, 82, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  &--home-top {
    background: linear-gradient(135deg, rgba(14, 25, 37, 0.3), rgba(14, 25, 37, 0.08));
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow:
      0 16px 34px rgba(8, 15, 24, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }
}

// 品牌标识
.site-brand {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
  padding: 6px 10px 6px 6px;
  border-radius: 999px;
  text-decoration: none;
  transition: background $header-transition, transform $button-transition;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-1px);
  }

  strong {
    color: var(--color-text-deep);
    font-size: 1.06rem;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  &__logo {
    width: auto;
    height: 38px;
    display: block;
  }

  .site-header--home-top & {
    background: rgba(255, 255, 255, 0.06);

    strong {
      color: #ffffff;
    }
  }
}

// 操作区域
.site-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
}

// 按钮基础样式
.site-header__button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  min-height: 42px;
  padding: 9px 20px;
  border: 1px solid transparent;
  border-radius: $radius-pill;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  transition: all $header-transition;

  &:focus-visible,
  .site-brand:focus-visible {
    outline: 2px solid rgba(47, 111, 148, 0.4);
    outline-offset: 3px;
  }

  // 菜单按钮
  &--menu {
    background: #1a1a1a;
    color: #ffffff;
    border: 1px solid #333333;
    min-width: 160px;

    &::after {
      content: '•';
      position: absolute;
      right: 10px;
      font-size: 1.4em;
      line-height: 1;
      color: #ffffff;
      opacity: 1;
      transition: opacity $header-transition;
    }

    &::before {
      content: '→';
      position: absolute;
      left: 10px;
      font-size: 1.2em;
      opacity: 0;
      transform: translateX(-10px);
      transition: opacity $header-transition, transform $header-transition;
    }

    &:hover {
      background: #0016ec;
      color: #ffffff;
      transform: translateY(-1px);
      padding-left: 34px;
      padding-right: 22px;

      &::before {
        opacity: 1;
        transform: translateX(0);
      }

      &::after {
        opacity: 0;
      }
    }
  }

  // 登录按钮
  &--login {
    background: rgba(255, 255, 255, 0.68);
    color: #18364a;
    border-color: rgba(188, 205, 219, 0.9);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    font-weight: 600;

    &:hover {
      background: #ffffff;
      color: #204e6a;
      border-color: rgba(47, 111, 148, 0.5);
      box-shadow: 0 10px 20px rgba(32, 78, 106, 0.12);
      transform: translateY(-2px);
    }

    .site-header--home-top & {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.28);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);

      &:hover {
        background: rgba(255, 255, 255, 0.22);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.38);
      }
    }
  }
}

// 响应式设计
@media (max-width: 760px) {
  .site-shell {
    width: var(--shell-width-mobile);
  }

  .site-header {
    width: var(--shell-width-mobile);
    gap: 10px;
    padding: 8px 10px;
  }

  .site-brand {
    strong {
      font-size: 1rem;
    }

    &__logo {
      height: 32px;
    }
  }

  .site-header__actions {
    gap: 6px;
  }

  .site-header__button {
    min-width: 0;
    min-height: 38px;
    padding: 8px 12px;
    font-size: 13px;

    &--menu {
      min-width: 132px;
      padding-inline: 14px 28px;

      &::after {
        right: 12px;
        font-size: 0.92rem;
      }
    }
  }
}

@media (max-width: 560px) {
  .site-brand {
    padding-right: 4px;

    &__logo {
      height: 28px;
    }
  }

  .site-header__button {
    &--menu {
      min-width: 116px;
    }

    &--login {
      min-width: 72px;
    }
  }
}
</style>
