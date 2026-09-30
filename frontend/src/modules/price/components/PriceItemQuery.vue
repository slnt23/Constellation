<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { usePriceItemStore } from '@/modules/price/store'

const store = usePriceItemStore()
const { selectedItem, searchResults, searchLoading } = storeToRefs(store)
const { searchItems, selectItem, clearSelection } = store

const keyword = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function immediateSearch() {
  if (debounceTimer) clearTimeout(debounceTimer)
  const trimmed = keyword.value.trim()
  if (!trimmed) {
    searchResults.value = []
    return
  }
  searchItems(trimmed)
}

watch(
  () => keyword.value,
  (val) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const trimmed = val.trim()
    if (!trimmed) {
      searchResults.value = []
      return
    }
    debounceTimer = setTimeout(() => {
      searchItems(trimmed)
    }, 400)
  },
)

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="price-item-query">
    <div class="query-search-area">
      <el-input v-model="keyword" placeholder="请输入物品名称" clearable size="default" :prefix-icon="'Search'"
        @keyup.enter="immediateSearch">
        <template #append>
          <el-button :loading="searchLoading" :icon="'Search'" @click="immediateSearch">查询</el-button>
        </template>
      </el-input>
    </div>

    <div v-if="!selectedItem && !searchLoading && searchResults.length === 0 && !keyword.trim()" class="query-hint">
      输入物品名称进行搜索
    </div>

    <div class="query-layout" v-else>
      <div class="query-left">
        <div v-if="searchLoading" class="query-loading">
          <el-icon class="is-loading"><span>Loading</span></el-icon>
          <span>搜索中...</span>
        </div>

        <div v-if="searchResults.length > 0 && !searchLoading" class="query-results">
          <div v-for="item in searchResults" :key="item.itemId" class="result-card"
            :class="{ 'result-card--active': selectedItem?.itemId === item.itemId }" @click="selectItem(item)">
            <div class="result-card__header">
              <span class="result-card__name">{{ item.itemName }}</span>
              <el-icon v-if="selectedItem?.itemId === item.itemId" class="result-card__check"><span>✓</span></el-icon>
              <el-tag size="small">{{ item.categoryName }}</el-tag>
            </div>
            <div class="result-card__meta">
              <span>{{ item.specification }}</span>
              <span class="result-card__unit">{{ item.unit }}</span>
            </div>
          </div>
        </div>

        <div v-if="!searchLoading && keyword.trim() && searchResults.length === 0" class="query-empty">
          未找到匹配的物品
        </div>
      </div>

      <div v-if="selectedItem" class="query-right">
        <div class="selected-card">
          <div class="selected-card__header">
            <span class="selected-card__title">已选物品</span>
            <el-button text size="small" type="danger" @click="clearSelection">清除</el-button>
          </div>
          <div class="selected-card__body">
            <div class="selected-card__name">{{ selectedItem.itemName }}</div>
            <div class="selected-card__meta">
              <el-tag size="small" type="info">{{ selectedItem.categoryName }}</el-tag>
              <span>{{ selectedItem.specification }}</span>
            </div>
            <div class="selected-card__info">
              <span>计量单位: {{ selectedItem.unit }}</span>
              <span class="selected-card__id">ID: {{ selectedItem.itemId }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-item-query {
  padding: 32px;
  max-width: 1024px;
}

.query-search-area {
  margin-bottom: 20px;
  // margin: 0 auto 20px;
  max-width: 680px;
}

.query-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: var(--theme-text-muted);
  font-size: 14px;
}

// ---- 双列布局 ----
.query-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.query-left {
  flex: 1;
  min-width: 0;
}

.query-right {
  flex-shrink: 0;
  width: 260px;
  position: sticky;
  top: 12px;
}

// ---- 搜索加载 / 空结果 ----
.query-loading,
.query-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px 0;
  color: var(--theme-text-muted);
  font-size: 14px;
  justify-content: center;
}

// ---- 结果列表 ----
.query-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-card {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-soft);
  border-radius: var(--theme-radius-card);
  padding: 14px 18px;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: var(--theme-text);
    box-shadow: var(--theme-shadow-card);
  }

  &--active {
    background: rgba(48, 209, 88, 0.06);
    border-color: #30d158;
    box-shadow: 0 0 0 1px rgba(48, 209, 88, 0.25);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  &__name {
    font-size: 16px;
    font-weight: 600;
    color: var(--theme-text);
    flex: 1;
  }

  &__check {
    color: #30d158;
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
  }

  &__meta {
    font-size: 13px;
    color: var(--theme-text-muted);
    display: flex;
    gap: 12px;
  }

  &__unit {
    color: var(--theme-text-muted);
  }
}

// ---- 已选物品详情卡片 ----
.selected-card {
  background: var(--theme-surface);
  border: 1px solid #30d158;
  border-left: 4px solid #30d158;
  border-radius: var(--theme-radius-card);
  padding: 18px 22px;
  box-shadow: var(--theme-shadow-card);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 12px;
    font-weight: 600;
    color: #30d158;
    letter-spacing: 0.06em;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__name {
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--theme-text);
    letter-spacing: -0.04em;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: var(--theme-text-muted);
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    color: var(--theme-text-muted);
  }

  &__id {
    color: var(--theme-text-muted);
  }
}

// ---- 移动端 ----
@media (max-width: 760px) {
  .price-item-query {
    padding: 20px;
  }

  .query-layout {
    flex-direction: column;
    gap: 16px;
  }

  .query-right {
    position: static;
    width: 100%;
    order: -1; // 移动端置顶
  }
}
</style>