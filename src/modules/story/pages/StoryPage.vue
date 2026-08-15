<script setup lang="ts">
import { computed, ref } from 'vue'
import GalleryLightbox from '@/modules/story/components/GalleryLightbox.vue'
import { STORY_GALLERY_ITEMS } from '@/modules/story/constants'

const activeIndex = ref(0)
const previewOpen = ref(false)

const activeItem = computed(() => STORY_GALLERY_ITEMS[activeIndex.value] ?? null)

const openPreview = (index: number) => {
  activeIndex.value = index
  previewOpen.value = true
}

const closePreview = () => {
  previewOpen.value = false
}

const showPrev = () => {
  activeIndex.value = (activeIndex.value - 1 + STORY_GALLERY_ITEMS.length) % STORY_GALLERY_ITEMS.length
}

const showNext = () => {
  activeIndex.value = (activeIndex.value + 1) % STORY_GALLERY_ITEMS.length
}
</script>

<template>
  <div class="story-gallery-page">
    <section class="story-gallery">
      <button
        v-for="(item, index) in STORY_GALLERY_ITEMS"
        :key="`${item.title}-${index}`"
        type="button"
        class="story-gallery__item"
        @click="openPreview(index)"
      >
        <img class="story-gallery__image" :src="item.thumbnail" :alt="item.title" />
        <span class="story-gallery__overlay" />
        <span class="story-gallery__content">
          <strong class="story-gallery__label">{{ item.title }}</strong>
          <small class="story-gallery__description">{{ item.description }}</small>
        </span>
      </button>
    </section>

    <GalleryLightbox
      :open="previewOpen"
      :items="STORY_GALLERY_ITEMS"
      :active-index="activeIndex"
      @close="closePreview"
      @prev="showPrev"
      @next="showNext"
    />

    <section v-if="activeItem" class="story-gallery__hint">
      <p>点击任意图片可放大浏览，支持左右切换与 `Esc` 关闭。</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.story-gallery-page {
  display: grid;
  gap: 16px;
  padding: 0 0 36px;
}

.story-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-right: calc(50% - 50vw);
  margin-left: calc(50% - 50vw);
  background: #0f1117;
}

.story-gallery__item {
  position: relative;
  display: block;
  min-width: 0;
  min-height: 22rem;
  padding: 0;
  border: none;
  background: #11151c;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
}

.story-gallery__image,
.story-gallery__overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.story-gallery__image {
  object-fit: cover;
  transition:
    transform 360ms ease,
    filter 360ms ease;
}

.story-gallery__overlay {
  background:
    linear-gradient(180deg, rgba(6, 10, 16, 0.08), rgba(6, 10, 16, 0.34)),
    linear-gradient(0deg, rgba(6, 10, 16, 0.72), rgba(6, 10, 16, 0) 34%);
  transition: background 240ms ease;
}

.story-gallery__content {
  position: absolute;
  right: 36px;
  bottom: 30px;
  left: 36px;
  z-index: 1;
  display: grid;
  gap: 12px;
}

.story-gallery__label {
  color: rgba(255, 255, 255, 0.94);
  font-size: 1.02rem;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.story-gallery__description {
  display: block;
  max-width: 34ch;
  color: rgba(255, 255, 255, 0.76);
  font-size: 0.92rem;
  font-weight: 400;
  line-height: 1.7;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.story-gallery__item:hover .story-gallery__image {
  transform: scale(1.04);
  filter: saturate(1.06);
}

.story-gallery__item:hover .story-gallery__overlay {
  background:
    linear-gradient(180deg, rgba(6, 10, 16, 0.08), rgba(6, 10, 16, 0.4)),
    linear-gradient(0deg, rgba(6, 10, 16, 0.82), rgba(6, 10, 16, 0.06) 46%);
}

.story-gallery__item:hover .story-gallery__description,
.story-gallery__item:focus-visible .story-gallery__description {
  opacity: 1;
  transform: translateY(0);
}

.story-gallery__item:focus-visible {
  outline: 3px solid rgba(255, 255, 255, 0.82);
  outline-offset: -3px;
}

.story-gallery__hint {
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.story-gallery__hint p {
  margin: 0;
  color: #5c6677;
  font-size: 0.92rem;
  letter-spacing: 0.04em;
}

@media (max-width: 960px) {
  .story-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .story-gallery__item {
    min-height: 18rem;
  }

  .story-gallery__content {
    right: 22px;
    bottom: 20px;
    left: 22px;
  }

  .story-gallery__label {
    font-size: 0.92rem;
  }
}

@media (max-width: 640px) {
  .story-gallery {
    grid-template-columns: 1fr;
  }

  .story-gallery__item {
    min-height: 13rem;
  }

  .story-gallery__content {
    right: 18px;
    bottom: 18px;
    left: 18px;
    gap: 8px;
  }

  .story-gallery__label {
    font-size: 0.86rem;
    letter-spacing: 0.12em;
  }

  .story-gallery__description {
    font-size: 0.8rem;
    line-height: 1.5;
  }
}

</style>
