<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },

  items: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="menu-panel">
      <div v-if="open" class="menu-panel">
        <section class="menu-panel__sheet glass-panel u-scrollbar-hidden">
          <div class="menu-panel__header">
            <h2 class="menu-panel__title">菜单</h2>
            <button class="ui-icon-close-button ui-icon-close-button--close ui-icon-close-button--right" type="button"
              @click="emit('close')">
              <img src="/src/shared/assets/modules/ICON_CLOSE.svg" alt="关闭" width="20" height="20" />
              <span class="visually-hidden">关闭</span>
            </button>
          </div>

          <div class="menu-panel__divider"></div>

          <div class="menu-panel__masonry">
            <RouterLink v-for="item in items" :key="item.path" :to="item.path" class="menu-panel__card"
              :class="`menu-panel__card--${item.size || 'normal'}`" @click="emit('close')">
              <img :src="item.image" :alt="item.title" />

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
    border-radius: var(--radius-soft-lg);
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(20px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

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
    }

    span {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.85rem;
      line-height: 1.4;
      font-weight: 400;
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

// 辅助类
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

// 动画
// :global(.menu-panel-enter-active),
// :global(.menu-panel-leave-active) {
//   transition: opacity 240ms ease;
// }

// :global(.menu-panel-enter-from),
// :global(.menu-panel-leave-to) {
//   opacity: 0;
// }

// :global(.menu-panel-enter-active .menu-panel__sheet),
:global(.menu-panel-leave-active .menu-panel__sheet) {
  transition: transform 280ms cubic-bezier(0.2, 0, 0, 1), opacity 240ms ease;
}

:global(.menu-panel-enter-from .menu-panel__sheet),
:global(.menu-panel-leave-to .menu-panel__sheet) {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}
</style>