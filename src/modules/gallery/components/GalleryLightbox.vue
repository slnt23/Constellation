<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import type { GalleryItemVO } from '@/modules/gallery/types'

const props = withDefaults(
    defineProps<{
        open?: boolean
        items?: GalleryItemVO[]
        activeIndex?: number
    }>(),
    {
        open: false,
        items: () => [],
        activeIndex: 0,
    },
)

const emit = defineEmits<{
    close: []
    prev: []
    next: []
}>()

const activeItem = computed(() => props.items[props.activeIndex] ?? null)
const canNavigate = computed(() => props.items.length > 1)

const handleKeydown = (event: KeyboardEvent) => {
    if (!props.open) {
        return
    }

    if (event.key === 'Escape') {
        emit('close')
    } else if (event.key === 'ArrowLeft' && canNavigate.value) {
        emit('prev')
    } else if (event.key === 'ArrowRight' && canNavigate.value) {
        emit('next')
    }
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
    },
    { immediate: true },
)

onBeforeUnmount(() => {
    document.body.style.overflow = ''
})

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="gallery-lightbox">
            <div v-if="open && activeItem" class="gallery-lightbox" @click.self="emit('close')">
                <div class="gallery-lightbox__backdrop" />

                <button class="gallery-lightbox__close" type="button" aria-label="关闭预览" @click="emit('close')">
                    ×
                </button>

                <button v-if="canNavigate" class="gallery-lightbox__nav gallery-lightbox__nav--prev" type="button"
                    aria-label="上一张" @click="emit('prev')">
                    ‹
                </button>

                <div class="gallery-lightbox__panel">
                    <img class="gallery-lightbox__image" :src="activeItem.imageUrl" :alt="activeItem.title" />

                    <div class="gallery-lightbox__caption">
                        <h3>{{ activeItem.title }}</h3>
                        <p v-if="activeItem.description">{{ activeItem.description }}</p>
                    </div>
                </div>

                <button v-if="canNavigate" class="gallery-lightbox__nav gallery-lightbox__nav--next" type="button"
                    aria-label="下一张" @click="emit('next')">
                    ›
                </button>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.gallery-lightbox {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 40px;
}

.gallery-lightbox__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(12, 16, 24, 0.72);
    backdrop-filter: blur(18px);
}

.gallery-lightbox__panel {
    position: relative;
    z-index: 1;
    width: min(1240px, calc(100vw - 120px));
    max-height: calc(100vh - 80px);
    overflow: hidden;
    background: #11151c;
    box-shadow: 0 32px 90px rgba(0, 0, 0, 0.34);
}

.gallery-lightbox__image {
    display: block;
    width: 100%;
    max-height: calc(100vh - 80px);
    object-fit: contain;
}

.gallery-lightbox__caption {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 28px 36px 32px;
    background: linear-gradient(180deg, rgba(8, 12, 18, 0) 0%, rgba(8, 12, 18, 0.9) 100%);
    color: #ffffff;
}

.gallery-lightbox__caption h3 {
    margin: 0 0 12px;
    font-size: clamp(1.5rem, 2vw, 2.2rem);
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.gallery-lightbox__caption p {
    max-width: 62ch;
    margin: 0;
    color: rgba(255, 255, 255, 0.84);
    font-size: 1rem;
}

.gallery-lightbox__close,
.gallery-lightbox__nav {
    position: absolute;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: rgba(255, 255, 255, 0.72);
    cursor: pointer;
    transition:
        color 180ms ease,
        transform 180ms ease;
}

.gallery-lightbox__close:hover,
.gallery-lightbox__nav:hover {
    color: #ffffff;
    transform: scale(1.06);
}

.gallery-lightbox__close {
    top: 54px;
    right: 72px;
    width: 44px;
    height: 44px;
    font-size: 2.4rem;
    font-weight: 200;
}

.gallery-lightbox__nav {
    top: 50%;
    width: 54px;
    height: 54px;
    font-size: 4.2rem;
    font-weight: 200;
    transform: translateY(-50%);
}

.gallery-lightbox__nav--prev {
    left: max(18px, calc((100vw - min(1240px, calc(100vw - 120px))) / 2 - 70px));
}

.gallery-lightbox__nav--next {
    right: max(18px, calc((100vw - min(1240px, calc(100vw - 120px))) / 2 - 70px));
}

.gallery-lightbox-enter-active,
.gallery-lightbox-leave-active {
    transition: opacity 220ms ease;
}

.gallery-lightbox-enter-active .gallery-lightbox__panel,
.gallery-lightbox-leave-active .gallery-lightbox__panel {
    transition:
        transform 260ms ease,
        opacity 220ms ease;
}

.gallery-lightbox-enter-from,
.gallery-lightbox-leave-to {
    opacity: 0;
}

.gallery-lightbox-enter-from .gallery-lightbox__panel,
.gallery-lightbox-leave-to .gallery-lightbox__panel {
    opacity: 0;
    transform: scale(0.97);
}

@media (max-width: 900px) {
    .gallery-lightbox {
        padding: 18px;
    }

    .gallery-lightbox__panel {
        width: min(100vw - 36px, 1240px);
        max-height: calc(100vh - 36px);
    }

    .gallery-lightbox__image {
        max-height: calc(100vh - 36px);
    }

    .gallery-lightbox__caption {
        padding: 20px 20px 24px;
    }

    .gallery-lightbox__close {
        top: 18px;
        right: 18px;
    }

    .gallery-lightbox__nav {
        width: 40px;
        height: 40px;
        font-size: 3rem;
    }

    .gallery-lightbox__nav--prev {
        left: 10px;
    }

    .gallery-lightbox__nav--next {
        right: 10px;
    }
}
</style>