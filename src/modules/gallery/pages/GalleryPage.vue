<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import GalleryLightbox from '@/modules/gallery/components/GalleryLightbox.vue'
import { useGalleryList } from '@/modules/gallery/composables'

const activeIndex = ref(0)
const previewOpen = ref(false)

const { galleryItems, isLoading, fetchGalleryItems } = useGalleryList()

const activeItem = computed(() => galleryItems.value[activeIndex.value] ?? null)

const openPreview = (index: number) => {
    activeIndex.value = index
    previewOpen.value = true
}

const closePreview = () => {
    previewOpen.value = false
}

const showPrev = () => {
    activeIndex.value = (activeIndex.value - 1 + galleryItems.value.length) % galleryItems.value.length
}

const showNext = () => {
    activeIndex.value = (activeIndex.value + 1) % galleryItems.value.length
}

onMounted(() => {
    fetchGalleryItems()
})
</script>

<template>
    <div class="gallery-page">
        <section v-if="isLoading" class="gallery-page__loading">
            <p>加载中...</p>
        </section>

        <section v-else-if="galleryItems.length" class="gallery-grid">
            <button v-for="(item, index) in galleryItems" :key="item.id" type="button" class="gallery-grid__item"
                @click="openPreview(index)">
                <img class="gallery-grid__image" :src="item.thumbnailUrl" :alt="item.title" />
                <span class="gallery-grid__overlay" />
                <span class="gallery-grid__content">
                    <strong class="gallery-grid__label">{{ item.title }}</strong>
                    <small class="gallery-grid__description">{{ item.description }}</small>
                </span>
            </button>
        </section>

        <section v-else class="gallery-page__empty">
            <p>暂无画廊内容</p>
        </section>

        <GalleryLightbox v-if="galleryItems.length" :open="previewOpen" :items="galleryItems"
            :active-index="activeIndex" @close="closePreview" @prev="showPrev" @next="showNext" />

        <section v-if="activeItem" class="gallery-page__hint">
            <p>点击任意图片可放大浏览，支持左右切换与 `Esc` 关闭。</p>
        </section>
    </div>
</template>

<style scoped lang="scss">
.gallery-page {
    display: grid;
    gap: 16px;
    padding: 0 0 36px;
}

.gallery-page__loading,
.gallery-page__empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #5c6677;
    font-size: 0.92rem;
    letter-spacing: 0.04em;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    margin-right: calc(50% - 50vw);
    margin-left: calc(50% - 50vw);
    background: #0f1117;
}

.gallery-grid__item {
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

.gallery-grid__image,
.gallery-grid__overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

.gallery-grid__image {
    object-fit: cover;
    transition:
        transform 360ms ease,
        filter 360ms ease;
}

.gallery-grid__overlay {
    background:
        linear-gradient(180deg, rgba(6, 10, 16, 0.08), rgba(6, 10, 16, 0.34)),
        linear-gradient(0deg, rgba(6, 10, 16, 0.72), rgba(6, 10, 16, 0) 34%);
    transition: background 240ms ease;
}

.gallery-grid__content {
    position: absolute;
    right: 36px;
    bottom: 30px;
    left: 36px;
    z-index: 1;
    display: grid;
    gap: 12px;
}

.gallery-grid__label {
    color: rgba(255, 255, 255, 0.94);
    font-size: 1.02rem;
    font-weight: 300;
    letter-spacing: 0.18em;
    text-transform: uppercase;
}

.gallery-grid__description {
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

.gallery-grid__item:hover .gallery-grid__image {
    transform: scale(1.04);
    filter: saturate(1.06);
}

.gallery-grid__item:hover .gallery-grid__overlay {
    background:
        linear-gradient(180deg, rgba(6, 10, 16, 0.08), rgba(6, 10, 16, 0.4)),
        linear-gradient(0deg, rgba(6, 10, 16, 0.82), rgba(6, 10, 16, 0.06) 46%);
}

.gallery-grid__item:hover .gallery-grid__description,
.gallery-grid__item:focus-visible .gallery-grid__description {
    opacity: 1;
    transform: translateY(0);
}

.gallery-grid__item:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.82);
    outline-offset: -3px;
}

.gallery-page__hint {
    display: flex;
    justify-content: center;
    padding: 0 20px;
}

.gallery-page__hint p {
    margin: 0;
    color: #5c6677;
    font-size: 0.92rem;
    letter-spacing: 0.04em;
}

@media (max-width: 960px) {
    .gallery-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .gallery-grid__item {
        min-height: 18rem;
    }

    .gallery-grid__content {
        right: 22px;
        bottom: 20px;
        left: 22px;
    }

    .gallery-grid__label {
        font-size: 0.92rem;
    }
}

@media (max-width: 640px) {
    .gallery-grid {
        grid-template-columns: 1fr;
    }

    .gallery-grid__item {
        min-height: 13rem;
    }

    .gallery-grid__content {
        right: 18px;
        bottom: 18px;
        left: 18px;
        gap: 8px;
    }

    .gallery-grid__label {
        font-size: 0.86rem;
        letter-spacing: 0.12em;
    }

    .gallery-grid__description {
        font-size: 0.8rem;
        line-height: 1.5;
    }
}
</style>