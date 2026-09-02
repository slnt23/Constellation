<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { User, Picture } from '@element-plus/icons-vue'
import GalleryLightbox from '@/modules/gallery/components/GalleryLightbox.vue'
import { useGalleryList } from '@/modules/gallery/composables'

const activeIndex = ref(0)
const previewOpen = ref(false)

const {
    galleryItems,
    isLoading,
    isPersonalMode,
    pageNum,
    pageSize,
    total,
    fetchGalleryItems,
    toggleMode,
    handlePageChange,
} = useGalleryList()

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
                <img class="gallery-grid__image" :src="item.thumbnailUrl || item.imageUrl" :alt="item.title" />
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

        <section v-if="galleryItems.length && total > pageSize" class="gallery-page__pagination">
            <el-pagination v-model:current-page="pageNum" :page-size="20" :total="total" layout="prev, pager, next"
                @current-change="handlePageChange" />
        </section>

        <button type="button" class="gallery-page__mode-toggle" @click="toggleMode">
            <el-icon :size="20">
                <User v-if="isPersonalMode" />
                <Picture v-else />
            </el-icon>
            <span>{{ isPersonalMode ? '我的图片' : '全部图片' }}</span>
        </button>
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

.gallery-page__pagination {
    display: flex;
    justify-content: center;
    padding: 24px 20px;
}

.gallery-page__mode-toggle {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 24px;
    background: rgba(17, 21, 28, 0.92);
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.92rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    cursor: pointer;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
    transition:
        background 220ms ease,
        transform 180ms ease;
}

.gallery-page__mode-toggle:hover {
    background: rgba(17, 21, 28, 0.98);
    transform: translateY(-2px);
}

.gallery-page__mode-toggle:active {
    transform: translateY(0);
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

    .gallery-page__mode-toggle {
        right: 16px;
        bottom: 16px;
        padding: 10px 16px;
        font-size: 0.86rem;
    }
}
</style>