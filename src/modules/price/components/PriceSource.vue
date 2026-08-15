<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { priceApi } from '@/modules/price/api'
import { PRICE_LOCATION_OPTIONS } from '@/modules/price/constants'
import { storeToRefs } from 'pinia'
import { usePriceItemStore } from '@/modules/price/store'
import type { SourceCompareVO } from '@/modules/price/types'

const loading = ref(false)
const sourceData = ref<SourceCompareVO[]>([])
const targetTime = ref<string | null>(null)

const { selectedItem, selectedLocationId } = storeToRefs(usePriceItemStore())

// 改为手动点击查询按钮触发
// watch(selectedItem, (item) => {
//   if (item) fetchSourceCompare()
// }, { immediate: true })

async function fetchSourceCompare() {
  if (!selectedItem.value) {
    ElMessage.warning('请先在「物品查询」中选择一个物品')
    return
  }
  loading.value = true
  try {
    const res = await priceApi.compareSource({
      itemId: selectedItem.value.itemId,
      locationId: selectedLocationId.value,
      targetTime: targetTime.value ?? new Date().toISOString().slice(0, 19),
    })
    sourceData.value = res.data ?? []
  } catch {
    ElMessage.error('查询失败，请稍后再试')
  } finally { loading.value = false }
}

const barOption = computed(() => {
  const sorted = [...sourceData.value].sort((a, b) => Number(a.price) - Number(b.price))
  const names = sorted.map((s) => s.sourceName)
  const prices = sorted.map((s) => Number(s.price))
  const confidences = sorted.map((s) => s.confidence)
  const reliabilities = sorted.map((s) => s.reliabilityLevel)

  return {
    title: { text: '各来源价格对比', left: 'center', textStyle: { color: '#171717' } },
    tooltip: {
      trigger: 'axis' as const, axisPointer: { type: 'shadow' as const },
      formatter: (params: any[]) => {
        const i = params[0].dataIndex
        return `${names[i]}<br/>价格: ¥${prices[i].toFixed(2)}<br/>可靠等级: Lv${reliabilities[i]}<br/>可信度: ${confidences[i]}%`
      },
    },
    grid: { left: 130, right: 55, top: 40, bottom: 50 },
    xAxis: { type: 'value' as const, name: '价格 (¥)', axisLabel: { formatter: '¥{value}', color: '#888888' } },
    yAxis: {
      type: 'category' as const,
      data: names,
      axisLabel: { color: '#4d4d4d' },
    },
    dataZoom: [{
      type: 'slider' as const,
      yAxisIndex: 0,
      left: 0,
      width: 16,
      show: names.length > 10,
    }],
    series: [{
      type: 'bar' as const,
      data: prices.map((price, i) => ({
        value: price,
        itemStyle: {
          color: confidences[i] >= 90 ? '#30d158' : confidences[i] >= 80 ? '#f5a623' : '#ee0000',
          borderRadius: [0, 4, 4, 0],
        },
      })),
      label: { show: true, position: 'right' as const, formatter: (p: any) => `¥${Number(p.value).toFixed(2)}` },
      markLine: {
        silent: true,
        data: [{ type: 'average' as const, name: '均价' }],
        lineStyle: { type: 'dashed' as const, color: '#a1a1a1' },
        label: { formatter: '均价 ¥{c}' },
      },
    }],
    toolbox: { feature: { saveAsImage: { title: '保存' } }, right: 10 },
  }
})

const bubbleOption = computed(() => {
  const maxReliability = Math.max(...sourceData.value.map((s) => s.reliabilityLevel), 1)

  return {
    title: { text: '价格 × 可信度', left: 'center', textStyle: { color: '#171717' } },
    tooltip: {
      trigger: 'item' as const,
      formatter: (params: any) => {
        const d = params.data
        return `<b>${d[3]}</b><br/>价格: ¥${Number(d[0]).toFixed(2)}<br/>可信度: ${d[1]}%<br/>可靠等级: Lv${d[2]}`
      },
    },
    grid: { left: 60, right: 30, top: 40, bottom: 40 },
    xAxis: {
      type: 'value' as const,
      name: '价格 (¥)',
      axisLabel: { formatter: '¥{value}', color: '#888888' },
    },
    yAxis: {
      type: 'value' as const,
      name: '可信度 (%)',
      min: 60,
      max: 100,
      axisLabel: { formatter: '{value}%', color: '#888888' },
    },
    series: [{
      type: 'scatter' as const,
      symbolSize: (data: number[]) => Math.max(12, (data[2] / maxReliability) * 48),
      data: sourceData.value.map((s) => [
        Number(s.price),
        s.confidence,
        s.reliabilityLevel,
        s.sourceName,
      ]),
      itemStyle: {
        color: (params: any) => {
          const conf = params.data?.[1] ?? 0
          return conf >= 90 ? '#30d158' : conf >= 80 ? '#f5a623' : '#ee0000'
        },
        opacity: 0.75,
      },
      label: {
        show: true,
        formatter: (params: any) => params.data?.[3] ?? '',
        position: 'right' as const,
        fontSize: 11,
        color: '#4d4d4d',
      },
      emphasis: {
        scale: 1.5,
        itemStyle: { opacity: 1 },
      },
    }],
    toolbox: { feature: { saveAsImage: { title: '保存' } }, right: 10 },
  }
})
</script>

<template>
  <div class="price-source">
    <div class="source-controls">
      <el-tag v-if="selectedItem" type="info" size="default">当前物品: {{ selectedItem.itemName }}</el-tag>
      <el-select v-model="selectedLocationId" placeholder="选择地区" clearable size="default">
        <el-option v-for="loc in PRICE_LOCATION_OPTIONS" :key="loc.value" :label="loc.label" :value="loc.value" />
      </el-select>
      <el-date-picker v-model="targetTime" type="datetime" placeholder="对比时间点" value-format="YYYY-MM-DDTHH:mm:ss"
        size="default" />
      <el-button type="primary" :loading="loading" @click="fetchSourceCompare" size="default">查询</el-button>
    </div>

    <div class="source-grid" v-if="selectedItem">
      <div class="source-panel">
        <v-chart :option="barOption" :autoresize="true" class="source-chart" />
      </div>
      <div class="source-panel">
        <v-chart :option="bubbleOption" :autoresize="true" class="source-chart" />
      </div>
    </div>

    <div v-if="!selectedItem" class="empty-hint">
      请先在「物品查询」中选择一个物品
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-source {
  padding: 32px;
}

.source-controls {
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

.source-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.source-panel {
  background: var(--vercel-canvas);
  border: 1px solid var(--vercel-hairline);
  border-radius: var(--vercel-rounded-lg);
  padding: 20px;
  box-shadow: var(--vercel-shadow-card);
}

.source-chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 900px) {
  .source-grid {
    grid-template-columns: 1fr;
  }
}

.empty-hint {
  text-align: center;
  color: var(--vercel-mute);
  font-size: 14px;
  padding: 48px 0;
}

@media (max-width: 760px) {
  .price-source {
    padding: 20px;
  }

  .source-chart {
    height: 320px;
  }
}
</style>
