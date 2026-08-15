<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import featureCardBack from '@/shared/assets/front/FEATURE_ITEMS.png'
import type { FeatureItem } from '@/shared/types'

const props = withDefaults(
  defineProps<{
    items?: FeatureItem[]
  }>(),
  {
    items: () => [],
  },
)

// 响应式引用
const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const isMobile = ref(false)
let ticking = false

// 工具函数
const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount
const mapProgress = (value: number, start: number, end: number) =>
  end <= start ? (value >= end ? 1 : 0) : clamp((value - start) / (end - start))

// 计算属性
const displayItems = computed(() => props.items.slice(0, 4))

const stage = computed(() => {
  const value = progress.value
  return {
    visible: mapProgress(value, 0.06, 0.18),
    spread: mapProgress(value, 0.18, 0.4),
    flip: mapProgress(value, 0.25, 0.45),
    detail: mapProgress(value, 0.42, 0.6),
  }
})

// 响应式函数
const updateViewportMode = () => {
  isMobile.value = window.innerWidth < 840
}

const updateProgress = () => {
  ticking = false
  if (!sectionRef.value) return

  const rect = sectionRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight || 1
  const travel = Math.max(rect.height + viewportHeight, 1)
  const passed = clamp(viewportHeight - rect.top, 0, travel)

  progress.value = clamp(passed / travel)
}

const requestProgressUpdate = () => {
  if (ticking) return
  ticking = true
  window.requestAnimationFrame(updateProgress)
}

// 卡片内容处理
const getCardLines = (item: FeatureItem) => {
  const lines = item.description
    .split(/[，。；;]/)
    .map(line => line.trim())
    .filter(Boolean)

  return lines.length > 1 ? lines.slice(0, 5) : [item.description]
}

// 卡片状态计算
const getCardState = (index: number) => {
  const stackedX = isMobile.value ? [-14, -4, 4, 14] : [-18, -6, 6, 18]
  const stackedY = isMobile.value ? [10, 3, -3, -10] : [16, 5, -5, -16]
  const stackedRotate = isMobile.value ? [-8, -3, 3, 8] : [-12, -4, 4, 12]

  const spreadX = isMobile.value ? [-132, -42, 42, 132] : [-500, -166, 166, 500]
  const spreadY = isMobile.value ? [8, -6, -6, 8] : [10, 0, 0, 10]
  const spreadRotate = isMobile.value ? [-7, -2.5, 2.5, 7] : [-2, 0, 0, 2]

  const stackScale = isMobile.value ? [0.84, 0.89, 0.89, 0.84] : [0.9, 0.95, 0.95, 0.9]
  const spreadScale = isMobile.value ? [0.84, 0.88, 0.88, 0.84] : [0.95, 1, 1, 0.95]

  const translateX = mix(stackedX[index] ?? 0, spreadX[index] ?? 0, stage.value.spread)
  const translateY = mix(stackedY[index] ?? 0, spreadY[index] ?? 0, stage.value.spread)
  const rotate = mix(stackedRotate[index] ?? 0, spreadRotate[index] ?? 0, stage.value.spread)
  const scale = mix(stackScale[index] ?? 1, spreadScale[index] ?? 1, stage.value.spread)
  const flipAngle = stage.value.flip * 180
  const opacity = mix(0, 1, stage.value.visible) * mix(0.82, 1, stage.value.detail)
  const sectionTravel = isMobile.value ? mix(26, -26, progress.value) : mix(42, -56, progress.value)

  return {
    opacity,
    transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY + sectionTravel}px, 0) rotate(${rotate}deg) scale(${scale})`,
    zIndex: index === 1 ? 4 : index === 2 ? 3 : index === 0 ? 2 : 1,
    innerTransform: `rotateY(${flipAngle}deg)`,
  }
}

const cardStates = computed(() => displayItems.value.map((_, index) => getCardState(index)))

// 生命周期
onMounted(() => {
  updateViewportMode()
  updateProgress()
  window.addEventListener('scroll', requestProgressUpdate, { passive: true })
  window.addEventListener('resize', () => {
    updateViewportMode()
    requestProgressUpdate()
  }, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestProgressUpdate)
  window.removeEventListener('resize', updateViewportMode)
})
</script>

<template>
  <section ref="sectionRef" class="feature-grid">
    <div class="feature-grid__stage">
      <div class="feature-grid__cards">
        <article v-for="(item, index) in displayItems" :key="`${item.title}-${index}`" class="feature-card" :style="{
          opacity: cardStates[index]?.opacity,
          transform: cardStates[index]?.transform,
          zIndex: cardStates[index]?.zIndex,
        }">
          <div class="feature-card__inner" :style="{ transform: cardStates[index]?.innerTransform }">
            <!-- 卡片背面 -->
            <div class="feature-card__face feature-card__face--back">
              <img :src="featureCardBack" :alt="`${item.title} 卡牌背面`" />
            </div>

            <!-- 卡片正面 -->
            <div class="feature-card__face feature-card__face--front">
              <div class="feature-card__front-top">
                <h3>{{ item.title }}</h3>
                <span class="feature-card__symbol">{{ item.icon || `0${index + 1}` }}</span>
              </div>

              <ul class="feature-card__list">
                <li v-for="line in getCardLines(item)" :key="line">
                  <span>{{ line }}</span>
                </li>
              </ul>

              <div class="feature-card__footer">
                <span class="feature-card__symbol feature-card__symbol--footer">
                  {{ item.icon || `0${index + 1}` }}
                </span>
                <strong>{{ item.title }}</strong>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
// 变量定义
$card-border-color: #f0f0f0;
$card-back-bg: #f8f9fa;
$card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
$card-inset-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);

// 基础网格布局
.feature-grid {
  position: relative;
  min-height: 100vh;
  // margin-left: calc(50% - 50vw);
  // margin-right: calc(50% - 50vw);
  background: #ffffff;
  overflow: clip;

  &__stage,
  &__cards {
    position: relative;
    width: 100%;
    min-height: inherit;
  }

  &__cards {
    perspective: 2200px;
    perspective-origin: center center;
  }
}

// 卡片样式
.feature-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(240px, 19vw, 430px);
  aspect-ratio: 0.72;
  transform-origin: center center;
  will-change: transform, opacity;

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  // 卡片面
  &__face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 24px;
    backface-visibility: hidden;
    border: 1px solid $card-border-color;
    box-shadow: $card-shadow, $card-inset-shadow;
    transition: box-shadow 0.3s ease, border-color 0.3s ease;

    &--back {
      background: $card-back-bg;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    &--front {
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 28px;
      padding: 28px 28px 22px;
      background: #ffffff;
      color: #1a1a1a;
      transform: rotateY(180deg);
    }
  }

  // 卡片内容布局
  &__front-top,
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  &__front-top h3,
  &__footer strong {
    margin: 0;
    font-size: clamp(1.2rem, 1.4vw, 1.9rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    text-transform: uppercase;
  }

  &__footer strong {
    transform: rotate(180deg);
  }

  // 符号样式
  &__symbol {
    font-size: clamp(2rem, 2.8vw, 3.5rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.08em;
    text-transform: uppercase;

    &--footer {
      transform: rotate(180deg);
    }
  }

  // 列表样式
  &__list {
    display: grid;
    align-content: start;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: grid;
      gap: 10px;

      &::after {
        content: '';
        height: 3px;
        border-radius: 999px;
        background-image: radial-gradient(circle, rgba(71, 97, 255, 0.28) 1.4px, transparent 1.6px);
        background-size: 10px 3px;
        background-repeat: repeat-x;
      }
    }

    span {
      font-size: clamp(1rem, 1.1vw, 1.28rem);
      line-height: 1.25;
    }
  }
}

// 响应式设计
@media (max-width: 1100px) {
  .feature-grid {
    min-height: 220vh;
  }

  .feature-card {
    width: clamp(160px, 23vw, 260px);

    &__face {
      border-radius: 20px;
      box-shadow:
        0 3px 15px rgba(0, 0, 0, 0.06),
        0 1px 5px rgba(0, 0, 0, 0.03),
        $card-inset-shadow;

      &--front {
        gap: 18px;
        padding: 18px 18px 16px;
      }
    }

    &__list {
      gap: 8px;

      span {
        font-size: 0.9rem;
      }
    }
  }
}

@media (max-width: 840px) {
  .feature-grid {
    min-height: 190vh;
  }

  .feature-card {
    width: clamp(145px, 34vw, 220px);

    &__face {
      border-radius: 16px;
      box-shadow:
        0 2px 10px rgba(0, 0, 0, 0.05),
        0 1px 3px rgba(0, 0, 0, 0.02),
        $card-inset-shadow;
    }

    &__front-top h3,
    &__footer strong {
      font-size: 0.95rem;
    }

    &__symbol {
      font-size: 1.8rem;
    }

    &__list span {
      font-size: 0.78rem;
    }
  }
}
</style>