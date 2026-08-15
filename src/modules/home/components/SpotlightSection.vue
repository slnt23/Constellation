<script setup lang="ts">
import { computed } from 'vue'
import type { SpotlightItem } from "@/shared/types";

const props = withDefaults(
  defineProps<{
    items?: SpotlightItem[]
  }>(),
  {
    items: () => [],
  },
)

const normalizedItems = computed(() =>
  props.items.map((item) => ({
    ...item,
    meta: item.eyebrow
      ? item.eyebrow
        .split(/[|/•,，]+/)
        .map((part) => part.trim())
        .filter(Boolean)
      : [],
  })),
)
</script>

<template>
  <section class="spotlight-list">
    <article v-for="item in normalizedItems" :key="item.title" class="spotlight-card">
      <div class="spotlight-card__media">
        <img class="spotlight-card__image" :src="item.imageUrl" :alt="item.title" />
        <div class="spotlight-card__overlay"></div>
        <div class="spotlight-card__body">
          <div class="spotlight-card__text">
            <p v-if="item.meta.length" class="spotlight-card__meta">
              {{ item.meta.join(' • ') }}
            </p>

            <h3 class="spotlight-card__title">
              <span>{{ item.title }}</span>
            </h3>

            <p v-if="item.description" class="spotlight-card__description">
              {{ item.description }}
            </p>
          </div>

          <a href="#" class="spotlight-card__link">
            了解更多 <span class="spotlight-card__arrow">→</span>
          </a>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped lang="scss">
.spotlight-list {
  padding: 40px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 36px 38px;
}

.spotlight-card {
  position: relative;
  cursor: pointer;
}

.spotlight-card__media {
  position: relative;
  overflow: hidden;
  // border-radius: 28px;
  background: #e9ebf8;
  aspect-ratio: 1 / 1;
  /* 方形 */
}

.spotlight-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.5s ease, filter 0.5s ease;
}

.spotlight-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent 40%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.spotlight-card__body {
  position: absolute;
  bottom: 24px;
  /* 默认距底部 30px */
  left: 24px;
  // right: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #fff;
}

.spotlight-card__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.spotlight-card__meta {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.spotlight-card__title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.2;
}

.spotlight-card__description {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.85);
}

.spotlight-card__link {
  display: inline-flex;
  align-items: center;
  // gap: 8px;
  // margin-top: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  text-decoration: none;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.spotlight-card__arrow {
  transition: transform 0.2s ease;
}

.spotlight-card:hover .spotlight-card__arrow {
  transform: translateX(4px);
}

.spotlight-card:hover .spotlight-card__image {
  transform: scale(1.05);
  filter: brightness(0.7);
}

.spotlight-card:hover .spotlight-card__overlay {
  opacity: 1;
}

/* 悬浮时文字整体上浮，刚好露出 “了解更多” */
.spotlight-card:hover .spotlight-card__text {
  transform: translateY(-40px);
}

.spotlight-card:hover .spotlight-card__link {
  opacity: 1;
  transform: translateY(0);
}

/* 响应式 */
@media (max-width: 1100px) {
  .spotlight-list {
    gap: 28px 24px;
  }

  .spotlight-card__body {
    left: 20px;
    right: 20px;
  }

  .spotlight-card__title {
    font-size: 1.6rem;
  }
}

@media (max-width: 760px) {
  .spotlight-list {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .spotlight-card__body {
    left: 16px;
    right: 16px;
    bottom: 20px;
  }

  .spotlight-card__title {
    font-size: 1.4rem;
  }

  .spotlight-card__description {
    font-size: 0.9rem;
  }
}
</style>