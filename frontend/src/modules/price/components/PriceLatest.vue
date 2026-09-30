<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { priceApi } from '@/modules/price/api'
import {
  PRICE_LOCATION_OPTIONS,
  PRICE_CURRENCY_OPTIONS,
} from '@/modules/price/constants'
import { storeToRefs } from 'pinia'
import { usePriceItemStore } from '@/modules/price/store'
import type { PriceLatestVO, Currency } from '@/modules/price/types'

const loading = ref(false)
const latestItem = ref<PriceLatestVO | null>(null)

const query = ref({
  currency: 'CNY' as Currency | undefined,
})

const { selectedItem, selectedLocationId } = storeToRefs(usePriceItemStore())

async function fetchLatest() {
  if (!selectedItem.value) {
    ElMessage.warning('请先在「物品查询」中选择一个物品')
    return
  }

  // 后端返回 id 字段（非 itemId），这里提取 itemId
  const itemId = selectedItem.value.itemId

  if (!itemId) {
    ElMessage.warning('无法获取物品ID，请返回「物品查询」重新选择物品')
    return
  }

  loading.value = true
  try {
    // console.log('查询参数：', {
    //   itemId: selectedItem.value.itemId,
    //   locationId: selectedLocationId.value,
    //   currency: query.value.currency,
    // })

    const res = await priceApi.getLatest({
      itemId: selectedItem.value.itemId,
      locationId: selectedLocationId.value,
      currency: query.value.currency,
    })
    latestItem.value = res.data
  } catch {
    ElMessage.error('查询失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

const gaugeOption = computed(() => {
  const c = latestItem.value?.confidence ?? 0
  return {
    series: [
      {
        type: 'pie' as const,
        radius: ['58%', '78%'],
        center: ['50%', '50%'],
        silent: true,
        label: {
          show: true, position: 'center' as const,
          formatter: () => `{big|${c.toFixed(1)}%}\n{small|可信度}`,
          rich: {
            big: { fontSize: 22, fontWeight: 600, color: 'var(--theme-text)', lineHeight: 28 },
            small: { fontSize: 12, color: 'var(--theme-text-muted)', lineHeight: 20 },
          },
        },
        data: [
          { value: c, name: '可信度', itemStyle: { color: c >= 90 ? '#30d158' : c >= 80 ? '#f5a623' : '#ee0000' } },
          { value: 100 - c, name: '', itemStyle: { color: 'var(--theme-border-soft)' }, label: { show: false } },
        ],
      },
      {
        type: 'pie' as const,
        radius: ['52%', '55%'],
        center: ['50%', '50%'],
        silent: true,
        label: { show: false },
        data: Array.from({ length: 40 }, (_, i) => ({
          value: 1,
          itemStyle: {
            color: i < (latestItem.value?.reliabilityLevel ?? 0) * 8 ? 'var(--theme-text)' : 'var(--theme-border-soft)',
            borderColor: 'var(--theme-surface)',
            borderWidth: 1,
          },
        })),
      },
    ],
  }
})
</script>

<template>
  <div class="price-latest">
    <div class="latest-controls">
      <el-tag v-if="selectedItem" type="info" size="default">当前物品: {{ selectedItem.itemName }}</el-tag>
      <el-select v-model="selectedLocationId" placeholder="选择地区" clearable filterable size="default">
        <el-option v-for="loc in PRICE_LOCATION_OPTIONS" :key="loc.value" :label="loc.label" :value="loc.value" />
      </el-select>
      <el-select v-model="query.currency" placeholder="币种" size="default">
        <el-option v-for="currency in PRICE_CURRENCY_OPTIONS" :key="currency.value" :label="currency.label"
          :value="currency.value" />
      </el-select>
      <el-button type="primary" :loading="loading" @click="fetchLatest" size="default">查询</el-button>
    </div>

    <div class="latest-card" v-if="selectedItem && latestItem">
      <div class="latest-card__left">
        <div class="latest-card__title">{{ latestItem.itemName }}</div>
        <div class="latest-card__meta">
          <el-tag size="small">{{ latestItem.categoryName }}</el-tag>
          <span>{{ latestItem.specification }}</span>
        </div>
        <div class="latest-card__price">
          <span class="price-value">¥{{ Number(latestItem.price).toFixed(2) }}</span>
          <span class="price-unit">/ {{ latestItem.priceUnit || latestItem.unit }}</span>
        </div>
        <div class="latest-card__info">
          <span>来源: {{ latestItem.sourceName }}</span>
          <span>地区: {{ latestItem.locationName }}</span>
          <span>更新: {{ latestItem.effectiveTime }}</span>
        </div>
      </div>
      <div class="latest-card__gauge">
        <v-chart :option="gaugeOption" :autoresize="true" class="gauge-chart" />
      </div>
    </div>

    <div v-if="!selectedItem" class="empty-hint">
      请先在「物品查询」中选择一个物品
    </div>
  </div>
</template>



<style scoped lang="scss">
.price-latest {
  padding: 32px;
}

.latest-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;

  .el-select {
    width: 170px;
  }
}

.latest-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-soft);
  border-radius: var(--theme-radius-card);
  padding: 28px 32px;
  box-shadow: var(--theme-shadow-card);

  &__left {
    flex: 1;
  }

  &__title {
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: 22px;
    font-weight: 600;
    color: var(--theme-text);
    letter-spacing: -0.04em;
    margin-bottom: 8px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 13px;
    color: var(--theme-text-muted);
  }

  &__price {
    margin-bottom: 16px;

    .price-value {
      font-family: 'Inter', 'Geist', system-ui, sans-serif;
      font-size: 42px;
      font-weight: 700;
      color: var(--theme-text);
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.04em;
    }

    .price-unit {
      font-size: 16px;
      color: var(--theme-text-muted);
      margin-left: 4px;
    }
  }

  &__info {
    display: flex;
    gap: 20px;
    font-size: 13px;
    color: var(--theme-text-muted);
  }

  &__gauge {
    flex-shrink: 0;
    width: 170px;
    height: 170px;
  }
}

.empty-hint {
  text-align: center;
  color: var(--theme-text-muted);
  font-size: 14px;
  padding: 48px 0;
}

.gauge-chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 760px) {
  .price-latest {
    padding: 20px;
  }

  .latest-card {
    flex-direction: column;
    padding: 20px;

    &__title {
      font-size: 18px;
    }

    &__price .price-value {
      font-size: 32px;
    }

    &__info {
      flex-wrap: wrap;
      gap: 12px;
    }
  }
}
</style>