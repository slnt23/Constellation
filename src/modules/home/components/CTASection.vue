<script setup lang="ts">
import type { MenuItem } from '@/shared/types'

withDefaults(
  defineProps<{ items?: MenuItem[] }>(),
  { items: () => [] },
)
</script>

<template>
  <section class="cta-section">
    <div class="cta-grid">
      <a
        v-for="item in items"
        :key="item.title"
        class="cta-card"
        :class="{ 'cta-card--large': item.size === 'large', 'cta-card--small': item.size === 'small' }"
        :href="item.path"
      >
        <div class="cta-card__bg">
          <img :src="item.image" :alt="item.title" />
          <div class="cta-card__overlay" />
        </div>

        <div class="cta-card__body">
          <h3 class="cta-card__title">{{ item.title }}</h3>
          <p class="cta-card__subtitle">{{ item.subtitle }}</p>
        </div>

        <span class="cta-card__arrow">→</span>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta-section {
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.cta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.cta-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 240px;
  padding: 28px 30px;
  border-radius: var(--vercel-rounded-md);
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  isolation: isolate;
  background: var(--vercel-canvas);
  border: 1px solid var(--vercel-hairline);
  box-shadow: var(--vercel-shadow-card);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(0,0,0,0.12) inset,
      0px 1px 1px rgba(0,0,0,0.03),
      0px 4px 8px rgba(0,0,0,0.06);

    .cta-card__bg img {
      transform: scale(1.04);
    }

    .cta-card__arrow {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &--large { min-height: 300px; }
  &--small { min-height: 200px; }
}

.cta-card__bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
}

.cta-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent 50%);
}

.cta-card__body {
  position: relative;
  z-index: 1;
}

.cta-card__title {
  margin: 0 0 6px;
  color: #ffffff;
  font-family: 'Inter', 'Geist', system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.cta-card__subtitle {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.35;
}

.cta-card__arrow {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--vercel-rounded-pill);
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 1rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

@media (max-width: 760px) {
  .cta-section {
    padding: 0 16px;
  }

  .cta-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .cta-card {
    min-height: 180px;
    padding: 22px 20px;
    border-radius: var(--vercel-rounded-sm);

    &--large { min-height: 220px; }
    &--small { min-height: 160px; }
  }

  .cta-card__title {
    font-size: 1.15rem;
  }

  .cta-card__arrow {
    right: 18px;
    bottom: 18px;
  }
}
</style>
