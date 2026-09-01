<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { priceApi } from '@/modules/price/api'
import { PRICE_LOCATION_OPTIONS } from '@/modules/price/constants'
import { storeToRefs } from 'pinia'
import { usePriceItemStore } from '@/modules/price/store'
import type { PriceCompareVO } from '@/modules/price/types'

const loading = ref(false)
const compareData = ref<PriceCompareVO | null>(null)
const targetTime = ref<string | null>(null)

const { selectedItem, selectedLocationId } = storeToRefs(usePriceItemStore())

// 改为手动点击查询按钮触发
// watch(selectedItem, (item) => {
//   if (item) fetchCompare()
// }, { immediate: true })

async function fetchCompare() {
  if (!selectedItem.value) {
    ElMessage.warning('请先在「物品查询」中选择一个物品')
    return
  }
  loading.value = true
  try {
    const res = await priceApi.compareLocation({
      itemId: selectedItem.value.itemId,
      locationId: selectedLocationId.value,
      targetTime: targetTime.value ?? new Date().toISOString().slice(0, 19),
    })
    compareData.value = res.data
  } catch {
    ElMessage.error('查询失败，请稍后再试')
  } finally { loading.value = false }
}

const chartOption = computed(() => {
  if (!compareData.value) return {}

  const list = [...compareData.value.prices].sort((a, b) => Number(b.price) - Number(a.price))
  const prices = list.map((s) => Number(s.price))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const mapData = list.map((s) => ({
    name: s.locationName,
    value: Number(s.price),
  }))

  return {
    title: {
      text: `${compareData.value.item.itemName} · 全国价格分布`,
      subtext: `数据时间: ${targetTime.value ? new Date(targetTime.value).toLocaleString('zh-CN') : '最新'}`,
      left: 'center',
      textStyle: { color: '#171717' },
    },
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        if (!params.data) return ''
        const d = params.data
        return `<b>${d.name}</b><br/>价格: ¥${d.value?.toFixed(2) ?? '-'}`
      },
    },
    visualMap: {
      min: minPrice,
      max: maxPrice,
      left: 'left',
      bottom: 20,
      calculable: true,
      inRange: { color: ['#e0f3db', '#a8ddb5', '#43a2ca', '#0868ac'] },
      text: ['高', '低'],
      formatter: (value: number) => `¥${value.toFixed(0)}`,
    },
    series: [{
      type: 'map' as const,
      map: 'china',
      roam: true,
      zoom: 1.2,
      center: [104.5, 38],
      label: {
        show: true,
        color: '#4d4d4d',
        fontSize: 10,
      },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' as const },
        itemStyle: { areaColor: '#fbb03b' },
      },
      data: mapData,
    }],
  }
})
</script>

<template>
  <div class="price-region">
    <div class="region-controls">
      <el-tag v-if="selectedItem" type="info" size="default">当前物品: {{ selectedItem.itemName }}</el-tag>
      <el-select v-model="selectedLocationId" placeholder="选择地区" clearable size="default">
        <el-option v-for="loc in PRICE_LOCATION_OPTIONS" :key="loc.value" :label="loc.label" :value="loc.value" />
      </el-select>
      <el-date-picker v-model="targetTime" type="datetime" placeholder="对比时间点" value-format="YYYY-MM-DDTHH:mm:ss"
        size="default" />
      <el-button type="primary" :loading="loading" @click="fetchCompare" size="default">查询</el-button>
    </div>

    <div class="region-card" v-if="selectedItem && compareData">
      <v-chart :option="chartOption" :autoresize="true" class="region-chart" />
    </div>

    <div v-if="!selectedItem" class="empty-hint">
      请先在「物品查询」中选择一个物品
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-region {
  padding: 32px;
}

.region-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;

  .el-select,
  .el-date-picker {
    width: 180px;
  }
}

.region-card {
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-soft);
  border-radius: var(--theme-radius-card);
  padding: 20px;
  box-shadow: var(--theme-shadow-card);
}

.region-chart {
  width: 100%;
  height: 560px;
}

.empty-hint {
  text-align: center;
  color: var(--theme-text-muted);
  font-size: 14px;
  padding: 48px 0;
}

@media (max-width: 760px) {
  .price-region {
    padding: 20px;
  }

  .region-chart {
    height: 400px;
  }
}
</style>