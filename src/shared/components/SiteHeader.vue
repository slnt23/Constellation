<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getCurrentUser, onAuthChange } from '@/core/permission'

const props = defineProps({
    isHome: { type: Boolean, default: false },
})

const emit = defineEmits(['toggle-menu', 'open-login', 'close-menu'])

const route = useRoute()
const isScrolled = ref(false)
const isHeaderVisible = ref(false)
const isHeaderPinned = ref(false)
const isHeaderForcedHidden = ref(!props.isHome)
const currentUser = ref(getCurrentUser())
let removeAuthListener = () => { }
let lastScrollY = 0
let lastShiftPressAt = 0
let pinnedHideTimer = 0
let scrollRafPending = false
let lastRefreshTs = 0

const shiftDoublePressGap = 360
const pinnedHeaderDuration = 5000
const scrollRevealThreshold = 12

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
    if (!isHeaderForcedHidden.value) {
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
        } else if (isHeaderPinned.value) {
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

watch(
    () => props.isHome,
    (val) => {
        if (val) {
            isHeaderForcedHidden.value = false
            isHeaderVisible.value = true
            isHeaderPinned.value = false
        } else {
            hideHeader()
        }
    },
)

watch(
    () => route.path,
    () => {
        emit('close-menu')
        if (props.isHome) {
            isHeaderForcedHidden.value = false
            isHeaderVisible.value = true
            isHeaderPinned.value = false
        } else {
            hideHeader()
        }
        window.requestAnimationFrame(() => {
            lastScrollY = window.scrollY
            syncScrollState()
        })
    },
)

onMounted(() => {
    lastScrollY = window.scrollY
    if (props.isHome) {
        isHeaderVisible.value = true
        isHeaderForcedHidden.value = false
    }
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
    <header class="site-header" :class="{
        'site-header--hidden': !isHeaderVisible,
    }">
        <RouterLink class="site-brand" to="/" @click="emit('close-menu')">
            <img class="site-brand__logo" src="@/shared/assets/logos/brand-home-header.png" alt="主页" />
            <span class="site-brand__name">主页中心</span>
        </RouterLink>

        <div class="site-header__actions">
            <button class="site-header__button site-header__button--menu" type="button" @click="emit('toggle-menu')">
                LET'S MENU
            </button>
            <button v-if="!currentUser" class="site-header__button site-header__button--login" type="button"
                @click="emit('open-login')">
                {{ accountLabel }}
            </button>
            <RouterLink v-else class="site-header__button site-header__button--login" :to="accountRoute"
                @click="emit('close-menu')">
                {{ accountLabel }}
            </RouterLink>
        </div>
    </header>
</template>

<style scoped lang="scss">
/* Apple 液态玻璃风格 — 所有参数写死，不依赖外部变量 */

.site-header {
    position: fixed;
    left: 50%;
    top: 12px;
    z-index: 40;
    width: min(1120px, calc(100% - 32px));
    transform: translate(-50%, 0);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 12px 8px 8px;
    height: 52px;
    border: 1px solid rgba(255, 255, 255, 0.45);
    border-radius: 999px;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0.72) 0%,
            rgba(255, 255, 255, 0.38) 100%);
    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.6),
        inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    transition: opacity 220ms ease, transform 220ms ease;

    &--hidden {
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, calc(-100% - 16px));
    }
}

.site-brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    padding: 4px 12px 4px 4px;
    border-radius: 999px;
    text-decoration: none;

    &__logo {
        height: 34px;
        width: auto;
        display: block;
    }

    &__name {
        color: #1d1d1f;
        font-size: 0.92rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        white-space: nowrap;
    }
}

.site-header__actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
}

.site-header__button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 6px 16px;
    border: 1px solid transparent;
    border-radius: 999px;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: all 200ms ease;

    &:focus-visible {
        outline: 2px solid rgba(0, 102, 204, 0.4);
        outline-offset: 2px;
    }

    &--menu {
        background: rgba(29, 29, 31, 0.92);
        color: #ffffff;
        border-color: rgba(29, 29, 31, 0.6);
        min-width: 136px;
        padding-right: 28px;

        &::after {
            content: '→';
            position: absolute;
            right: 12px;
            font-size: 1rem;
            opacity: 0.7;
            transition: opacity 200ms ease, transform 200ms ease;
        }

        &:hover {
            background: rgba(0, 102, 204, 0.95);
            border-color: rgba(0, 102, 204, 0.8);
            transform: translateY(-1px);

            &::after {
                opacity: 1;
                transform: translateX(2px);
            }
        }
    }

    &--login {
        background: rgba(255, 255, 255, 0.55);
        color: #1d1d1f;
        border-color: rgba(0, 0, 0, 0.08);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
        font-weight: 600;

        &:hover {
            background: rgba(255, 255, 255, 0.85);
            border-color: rgba(0, 0, 0, 0.12);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
            transform: translateY(-1px);
        }
    }
}

@media (max-width: 760px) {
    .site-header {
        width: calc(100% - 24px);
        top: 8px;
        height: 48px;
        padding: 6px 8px 6px 6px;
        gap: 8px;
    }

    .site-brand {
        padding: 4px 8px 4px 4px;
        gap: 6px;

        &__logo {
            height: 28px;
        }

        &__name {
            font-size: 0.84rem;
        }
    }

    .site-header__actions {
        gap: 6px;
    }

    .site-header__button {
        min-height: 32px;
        padding: 5px 12px;
        font-size: 0.78rem;

        &--menu {
            min-width: 116px;
            padding-right: 24px;
        }
    }
}

@media (max-width: 560px) {
    .site-header {
        width: calc(100% - 16px);
        top: 6px;
        height: 44px;
        padding: 4px 6px 4px 4px;
    }

    .site-brand {
        &__logo {
            height: 24px;
        }

        &__name {
            display: none;
        }
    }

    .site-header__button {
        &--menu {
            min-width: 100px;
        }

        &--login {
            min-width: 64px;
        }
    }
}
</style>