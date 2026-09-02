<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface MenuItem {
  path: string
  title: string
  subtitle: string
  image: string
  size?: 'large' | 'normal' | 'small'
}

interface Props {
  open: boolean
  items: MenuItem[]
}

defineProps<Props>()

const emit = defineEmits(['close'])

const imageLoadStates = ref<Record<string, 'loading' | 'loaded' | 'error'>>({})

function handleImageLoad(path: string) {
  imageLoadStates.value[path] = 'loaded'
}

function handleImageError(path: string) {
  imageLoadStates.value[path] = 'error'
}

function handleBackdropClick(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('menu-panel')) {
    emit('close')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-panel">
      <div v-if="open" class="menu-panel" role="dialog" aria-modal="true" aria-label="导航菜单"
        @click="handleBackdropClick">
        <section class="menu-panel__sheet glass-panel">
          <div class="menu-panel__header">
            <h2 class="menu-panel__title">菜单</h2>
            <button class="ui-icon-close-button ui-icon-close-button--close ui-icon-close-button--right" type="button"
              aria-label="关闭菜单" @click="emit('close')">
              <img src="/src/shared/assets/icons/close.svg" alt="" width="20" height="20" aria-hidden="true" />
            </button>
          </div>

          <div class="menu-panel__divider"></div>

          <div class="menu-panel__masonry">
            <RouterLink v-for="item in items" :key="item.path" :to="item.path" class="menu-panel__card"
              :class="`menu-panel__card--${item.size || 'normal'}`" @click="emit('close')">
              <div v-if="imageLoadStates[item.path] !== 'loaded'" class="menu-panel__card-placeholder"></div>
              <img v-show="imageLoadStates[item.path] === 'loaded'" :src="item.image" :alt="item.title"
                @load="handleImageLoad(item.path)" @error="handleImageError(item.path)" />

              <div class="menu-panel__card-overlay">
                <p>{{ item.title }}</p>
                <span>{{ item.subtitle }}</span>
              </div>
            </RouterLink>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.menu-panel {
  --menu-panel-radius: 32px;
  --menu-panel-surface: rgba(255, 255, 255, 0.92);

  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(10, 18, 28, 0.18);
  backdrop-filter: blur(12px);

  &__sheet {
    position: relative;
    width: min(78vw, 1380px);
    height: 80vh;
    margin: 10vh auto;
    overflow-y: auto;
    border-radius: var(--menu-panel-radius);
    background: var(--menu-panel-surface);
    backdrop-filter: blur(20px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      margin: 8px 0;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 3px;
      transition: background 0.2s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.25);
      }
    }

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.15) transparent;

    @media (max-width: 960px) {
      width: min(92vw, 1380px);
    }

    @media (max-width: 760px) {
      width: calc(100vw - 32px);
      height: auto;
      max-height: 84vh;
      margin: 8vh auto;
      border-radius: 28px;
    }
  }

  &__header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20px);

    @media (max-width: 760px) {
      padding: 18px 20px;
    }
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;

    @media (max-width: 760px) {
      font-size: 1.35rem;
    }
  }

  &__divider {
    height: 1px;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.04) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.04) 100%);
    margin: 0;
  }

  &__masonry {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 120px;
    gap: 18px;
    padding: 24px;

    @media (max-width: 960px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
      padding: 20px;
    }

    @media (max-width: 760px) {
      grid-template-columns: 1fr;
      grid-auto-rows: 110px;
      gap: 14px;
      padding: 20px;
    }
  }

  &__card {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    background: #f8f8f8;
    transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
    isolation: isolate;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);

      img {
        transform: scale(1.05);
        filter: saturate(1.1) brightness(0.85);
      }
    }

    &:active {
      transform: translateY(-2px);
    }

    &--large {
      grid-row: span 4;
    }

    &--normal {
      grid-row: span 3;
    }

    &--small {
      grid-row: span 2;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(1.04) brightness(0.82);
      transition: all 0.5s cubic-bezier(0.2, 0, 0, 1);
    }
  }

  &__card-placeholder {
    position: absolute;
    inset: 0;
    background: linear-gradient(110deg, #f0f0f0 8%, #e8e8e8 18%, #f0f0f0 33%);
    background-size: 200% 100%;
    animation: shimmer 1.5s linear infinite;
    border-radius: 16px;
  }

  &__card-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px 16px 16px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.65) 100%);

    p {
      margin: 0 0 6px;
      color: #ffffff;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      line-height: 1.3;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    span {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.85rem;
      line-height: 1.4;
      font-weight: 400;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @media (max-width: 760px) {
      padding: 16px 14px 14px;

      p {
        font-size: 1.1rem;
        margin-bottom: 4px;
      }

      span {
        font-size: 0.8rem;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

:global(.menu-panel-enter-active),
:global(.menu-panel-leave-active) {
  transition: opacity 240ms ease;
}

:global(.menu-panel-enter-from),
:global(.menu-panel-leave-to) {
  opacity: 0;
}

:global(.menu-panel-enter-active .menu-panel__sheet),
:global(.menu-panel-leave-active .menu-panel__sheet) {
  transition: transform 280ms cubic-bezier(0.2, 0, 0, 1), opacity 240ms ease;
}

:global(.menu-panel-enter-from .menu-panel__sheet),
:global(.menu-panel-leave-to .menu-panel__sheet) {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>