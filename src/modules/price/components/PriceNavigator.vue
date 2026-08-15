<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { PRICE_NAV_ITEMS } from '@/modules/price/constants'

const emit = defineEmits<{ (e: 'navigate', index: string): void }>()

const { width } = useWindowSize()
const activeIndex = ref('0')
const menuMode = computed(() => (width.value <= 760 ? 'horizontal' : 'vertical'))

const handleSelect = (index: string) => {
  activeIndex.value = index
  emit('navigate', index)
}
</script>

<template>
  <nav class="price-nav">
    <div class="price-nav__header">
      <span class="price-nav__brand">价格行情</span>
    </div>
    <el-menu
      :default-active="activeIndex"
      :mode="menuMode"
      @select="handleSelect"
    >
      <el-menu-item v-for="item in PRICE_NAV_ITEMS" :key="item.index" :index="item.index">
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </el-menu-item>
    </el-menu>
  </nav>
</template>

<style scoped lang="scss">
.price-nav {
  display: flex;
  flex-direction: column;
  width: 220px;
  background: var(--vercel-canvas);
  border-right: 1px solid var(--vercel-hairline);
}

.price-nav__header {
  padding: 16px 16px 12px;
  margin: 4px 8px 0;
  border-bottom: 1px solid var(--vercel-hairline);
}

.price-nav__brand {
  font-family: 'Inter', 'Geist', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--vercel-ink);
  letter-spacing: -0.03em;
}

// el-menu 样式覆盖
:deep(.el-menu) {
  border-right: none;
  background: var(--vercel-canvas);

  .el-menu-item {
    margin: 2px 8px;
    border-radius: var(--vercel-rounded-sm);
    color: var(--vercel-body);
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.02em;
    height: 38px;
    line-height: 38px;

    &:hover {
      background: var(--vercel-canvas-soft);
      color: var(--vercel-ink);
    }

    &.is-active {
      color: var(--vercel-ink);
      background: rgba(0, 0, 0, 0.04);
      box-shadow: inset 3px 0 0 var(--vercel-ink);
    }
  }
}

@media (max-width: 760px) {
  .price-nav {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--vercel-hairline);
  }

  .price-nav__header {
    display: none;
  }

  :deep(.el-menu) {
    .el-menu-item {
      margin: 0;
      padding: 0 12px;
      height: 40px;
      line-height: 40px;

      &.is-active {
        box-shadow: inset 0 -2px 0 var(--vercel-ink);
      }
    }
  }
}
</style>
