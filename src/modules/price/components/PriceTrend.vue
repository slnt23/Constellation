<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { priceApi } from '@/modules/price/api'
import {
  PRICE_GRANULARITY_OPTIONS,
} from '@/modules/price/constants'
import { storeToRefs } from 'pinia'
import { usePriceItemStore } from '@/modules/price/store'
import type { PriceTrendVO, TimeGranularity } from '@/modules/price/types'

const loading = ref(false)
const trendData = ref<PriceTrendVO[]>([])
const dateRange = ref<[string, string] | null>(null)

const query = ref<{ granularity: TimeGranularity }>({
  granularity: 'DAY',
})

const { selectedItem } = storeToRefs(usePriceItemStore())

// 改为手动点击查询按钮触发
// watch(selectedItem, (item) => {
//   if (item && dateRange.value) fetchTrend()
// }, { immediate: true })

async function fetchTrend() {
  if (!selectedItem.value) {
    ElMessage.warning('请先在「物品查询」中选择一个物品')
    return
  }
  if (!dateRange.value) return
  loading.value = true
  try {
    const res = await priceApi.getTrend({
      itemId: selectedItem.value.itemId,
      granularity: query.value.granularity,
      startTime: dateRange.value[0],
      endTime: dateRange.value[1],
    })
    trendData.value = res.data ?? []
  } catch {
    ElMessage.error('查询失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

// 根据时间粒度获取轴标签和 X 轴最小刻度间隔
function getAxisTimeConfig(granularity: string): {
  minInterval: number | undefined
  format: (value: number) => string
} {
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: granularity === 'YEAR' ? undefined : '2-digit',
    day: granularity === 'YEAR' || granularity === 'MONTH' ? undefined : '2-digit',
    hour: granularity === 'HOUR' ? '2-digit' : undefined,
    minute: granularity === 'HOUR' ? '2-digit' : undefined,
  })

  let minInterval: number | undefined
  switch (granularity) {
    case 'HOUR':
      minInterval = 3600 * 1000
      break
    case 'DAY':
      minInterval = 86400 * 1000
      break
    case 'WEEK':
      minInterval = 7 * 86400 * 1000
      break
    case 'MONTH':
      minInterval = 28 * 86400 * 1000
      break
    case 'YEAR':
      minInterval = 365 * 86400 * 1000
      break
  }

  let lastLabel = ''
  const format = (value: number): string => {
    const label = fmt.format(new Date(value))
    if (label === lastLabel) return ''
    lastLabel = label
    return label
  }

  return { minInterval, format }
}

const chartOption = computed(() => {
  const granularity = query.value.granularity
  const axisCfg = getAxisTimeConfig(granularity)
  const seriesList = trendData.value.map((vo) => ({
    name: `${vo.itemName} · ${vo.locationName}`,
    type: 'line' as const,
    smooth: true,
    symbol: granularity === 'HOUR' ? 'circle' : 'none',
    symbolSize: 4,
    data: vo.trend.map((p) => [p.time, Number(p.price)]),
    markLine: {
      silent: true,
      data: [{ type: 'average' as const, name: '均价' }],
      lineStyle: { type: 'dashed' as const, color: '#a1a1a1' },
      label: { formatter: '均价 {c}' },
    },
    markPoint: {
      data: [
        { type: 'max' as const, name: '最高' },
        { type: 'min' as const, name: '最低' },
      ],
    },
  }))

  return {
    tooltip: {
      trigger: 'axis' as const,
      formatter: (params: any[]) =>
        params.map((p) => {
          const timeStr = new Date(p.axisValue).toLocaleString('zh-CN', {
            year: 'numeric',
            month: granularity === 'YEAR' ? undefined : '2-digit',
            day: granularity === 'YEAR' || granularity === 'MONTH' ? undefined : '2-digit',
            hour: granularity === 'HOUR' ? '2-digit' : undefined,
            minute: granularity === 'HOUR' ? '2-digit' : undefined,
          })
          return `${p.marker} ${p.seriesName}<br/>时间: ${timeStr}<br/>价格: ¥${Number(p.value[1]).toFixed(2)}`
        }).join('<br/>'),
    },
    legend: { top: 0, type: 'scroll' as const, textStyle: { color: '#4d4d4d' } },
    grid: { left: 55, right: 25, top: 40, bottom: 60 },
    xAxis: {
      type: 'time' as const,
      name: '时间',
      minInterval: axisCfg.minInterval,
      axisLabel: {
        formatter: axisCfg.format,
        color: '#888888',
        rotate: granularity === 'HOUR' ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value' as const, name: '价格 (¥)',
      axisLabel: { formatter: '¥{value}', color: '#888888' },
    },
    dataZoom: [
      { type: 'slider' as const, bottom: 20, height: 24 },
      { type: 'inside' as const },
    ],
    toolbox: { feature: { saveAsImage: { title: '保存' } }, right: 10 },
    series: seriesList,
  }
})
</script>

<template>
  <div class="price-trend">
    <div class="trend-controls">
      <el-tag v-if="selectedItem" type="info" size="default">
        当前物品: {{ selectedItem.itemName }}
      </el-tag>
      <el-select v-model="query.granularity" placeholder="时间粒度" size="default">
        <el-option v-for="option in PRICE_GRANULARITY_OPTIONS" :key="option.value" :label="option.label"
          :value="option.value" />
      </el-select>
      <el-date-picker v-model="dateRange" type="datetimerange" range-separator="至" start-placeholder="开始时间"
        end-placeholder="结束时间" value-format="YYYY-MM-DDTHH:mm:ss" size="default" />
      <el-button type="primary" :loading="loading" @click="fetchTrend" size="default">查询</el-button>
    </div>

    <div class="trend-card" v-if="selectedItem">
      <v-chart :option="chartOption" :autoresize="true" class="trend-chart" />
    </div>

    <div v-if="!selectedItem" class="empty-hint">
      请先在「物品查询」中选择一个物品
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-trend {
  padding: 32px;
}

.trend-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;

  .el-select,
  .el-date-picker {
    width: 190px;
  }
}

.trend-card {
  background: var(--vercel-canvas);
  border: 1px solid var(--vercel-hairline);
  border-radius: var(--vercel-rounded-lg);
  padding: 20px;
  box-shadow: var(--vercel-shadow-card);
}

.trend-chart {
  width: 100%;
  height: 440px;
}

.empty-hint {
  text-align: center;
  color: var(--vercel-mute);
  font-size: 14px;
  padding: 48px 0;
}

@media (max-width: 760px) {
  .price-trend {
    padding: 20px;
  }

  .trend-chart {
    height: 340px;
  }
}
</style>
