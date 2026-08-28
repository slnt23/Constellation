<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { appMeta } from '@/core/config/app.config'
import heroVideo2 from '@/shared/assets/home/hero-v1.mp4'
import heroVideo1 from '@/shared/assets/home/hero-v2.mp4'
import poster404 from '@/shared/assets/home/error-404.png'

const videos = [heroVideo2, heroVideo1]
const currentIndex = ref(0)
const heroRef = ref<HTMLElement | null>(null)
const isMuted = ref(true)
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => { touchStartX = e.changedTouches[0].screenX }
const handleTouchEnd = (e: TouchEvent) => { touchEndX = e.changedTouches[0].screenX; handleSwipe() }
const handleMouseDown = (e: MouseEvent) => { touchStartX = e.screenX }
const handleMouseUp = (e: MouseEvent) => { touchEndX = e.screenX; handleSwipe() }

const handleSwipe = () => {
  if (videos.length <= 1) return
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) diff > 0 ? prevVideo() : nextVideo()
}

const nextVideo = () => { currentIndex.value = (currentIndex.value + 1) % videos.length }
const prevVideo = () => { currentIndex.value = (currentIndex.value - 1 + videos.length) % videos.length }

const toggleMute = () => {
  isMuted.value = !isMuted.value
  const v = document.querySelector('.home-hero__video--active') as HTMLVideoElement | null
  if (v) v.muted = isMuted.value
}

const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
const pauseAllVideos = () => document.querySelectorAll('.home-hero__video').forEach((v) => (v as HTMLVideoElement).pause())
const playCurrentVideo = () => {
  const v = document.querySelector('.home-hero__video--active') as HTMLVideoElement | null
  v?.play().catch(() => { })
}

const handleScroll = () => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const visible = rect.top < window.innerHeight && rect.bottom > 0
  visible ? playCurrentVideo() : pauseAllVideos()
}

onMounted(() => {
  heroRef.value?.addEventListener('touchstart', handleTouchStart)
  heroRef.value?.addEventListener('touchend', handleTouchEnd)
  heroRef.value?.addEventListener('mousedown', handleMouseDown)
  heroRef.value?.addEventListener('mouseup', handleMouseUp)
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  heroRef.value?.removeEventListener('touchstart', handleTouchStart)
  heroRef.value?.removeEventListener('touchend', handleTouchEnd)
  heroRef.value?.removeEventListener('mousedown', handleMouseDown)
  heroRef.value?.removeEventListener('mouseup', handleMouseUp)
  window.removeEventListener('scroll', handleScroll)
  pauseAllVideos()
})
</script>

<template>
  <section class="home-hero" ref="heroRef">
    <video v-for="(video, index) in videos" :key="index" class="home-hero__video"
      :class="{ 'home-hero__video--active': index === currentIndex }" :poster="poster404" autoplay loop muted
      playsinline>
      <source :src="video" type="video/mp4" />
    </video>

    <div class="home-hero__overlay" />
    <div class="home-hero__gradient" />

    <div class="home-hero__content">
      <p class="home-hero__eyebrow">{{ appMeta.hero.eyebrow }}</p>
      <h1 class="home-hero__headline">{{ appMeta.hero.headline }}</h1>
      <p class="home-hero__subtitle">{{ appMeta.hero.subtitle }}</p>
      <button class="home-hero__cta" @click="scrollDown">
        {{ appMeta.hero.cta }}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>

    <div class="home-hero__controls">
      <button class="home-hero__button" @click="toggleMute" :aria-label="isMuted ? '取消静音' : '静音'">
        <svg v-if="isMuted" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      </button>

      <template v-if="videos.length > 1">
        <button class="home-hero__button" @click="prevVideo" aria-label="上一个视频">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div class="home-hero__indicators">
          <span v-for="(_, index) in videos" :key="index" class="home-hero__indicator"
            :class="{ 'home-hero__indicator--active': index === currentIndex }" @click="currentIndex = index" />
        </div>

        <button class="home-hero__button" @click="nextVideo" aria-label="下一个视频">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </template>

      <button class="home-hero__button" @click="scrollDown" aria-label="向下滚动">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
$runway-black: #000000;
$pure-white: #ffffff;
$hero-overlay-color: rgba(10, 23, 35, 0.45);

.home-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow: hidden;
  background-color: $runway-black;

  &__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;

    &--active {
      opacity: 1;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, $hero-overlay-color, rgba(10, 23, 35, 0.65));
    z-index: 1;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    z-index: 2;
    opacity: 0.38;
    background:
      radial-gradient(ellipse 80% 60% at 30% 20%, rgba(0, 124, 240, 0.35), transparent 55%),
      radial-gradient(ellipse 60% 70% at 70% 40%, rgba(121, 40, 202, 0.28), transparent 55%),
      radial-gradient(ellipse 70% 50% at 50% 70%, rgba(255, 0, 128, 0.22), transparent 55%),
      radial-gradient(ellipse 50% 40% at 80% 80%, rgba(249, 203, 40, 0.18), transparent 50%);
    pointer-events: none;
  }

  // ========== 文字内容 ==========
  &__content {
    position: relative;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 720px;
    padding: 0 24px;
  }

  &__eyebrow {
    margin: 0 0 16px;
    font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
    font-size: 0.82rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.65);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  &__headline {
    margin: 0 0 20px;
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 600;
    line-height: 1.12;
    letter-spacing: -0.05em;
    color: $pure-white;
  }

  &__subtitle {
    margin: 0 0 36px;
    max-width: 520px;
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.72);
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    border: none;
    border-radius: var(--vercel-rounded-pill);
    background: $pure-white;
    color: var(--vercel-ink);
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
    }

    svg {
      flex-shrink: 0;
    }
  }

  // ========== 底部控件 ==========
  &__controls {
    position: absolute;
    bottom: 40px;
    left: 50%;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 14px;
    transform: translateX(-50%);
  }

  &__indicators {
    display: flex;
    gap: 10px;
  }

  &__indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    cursor: pointer;
    transition: all 0.25s ease;

    &--active {
      background: rgba(255, 255, 255, 0.9);
      transform: scale(1.25);
    }

    &:hover {
      background: rgba(255, 255, 255, 0.6);
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--vercel-rounded-sm);
    background: rgba(255, 255, 255, 0.08);
    color: $pure-white;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.18);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

@media (max-width: 760px) {
  .home-hero {
    &__headline {
      font-size: clamp(2rem, 10vw, 2.8rem);
    }

    &__subtitle {
      font-size: 1rem;
    }

    &__controls {
      bottom: 28px;
    }
  }
}
</style>