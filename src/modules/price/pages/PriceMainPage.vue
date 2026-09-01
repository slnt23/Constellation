<script setup lang="ts">
import { ref } from 'vue'
import { PRICE_TAB_COMPONENT_MAP } from '@/modules/price/constants'
import { usePriceItemStore } from '@/modules/price/store'
import PriceNavigator from '@/modules/price/components/PriceNavigator.vue'

const activeNav = ref('0')
const handleNavigate = (index: string) => { activeNav.value = index }

// 确保 singleton composable 在父级初始化
usePriceItemStore()
</script>

<template>
  <div class="price-main-layout">
    <aside class="price-sidebar">
      <PriceNavigator @navigate="handleNavigate" />
    </aside>
    <main class="price-content">
      <KeepAlive>
        <component :is="PRICE_TAB_COMPONENT_MAP[activeNav]" />
      </KeepAlive>
    </main>
  </div>
</template>

<style scoped lang="scss">
.price-main-layout {
  display: flex;
  height: 100vh;
  background: var(--theme-canvas);
}

.price-sidebar {
  flex-shrink: 0;
  display: flex;
  background: var(--theme-surface);
}

.price-content {
  flex: 1;
  overflow-y: auto;
  background: var(--theme-canvas);
}

@media (max-width: 760px) {
  .price-main-layout {
    flex-direction: column;
  }

  .price-sidebar {
    position: sticky;
    top: var(--site-header-height, 54px);
    z-index: 10;
  }
}
</style>