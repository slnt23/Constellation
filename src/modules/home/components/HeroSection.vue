<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import heroV1 from '@/shared/assets/home/hero-v1.mp4'
import { appMeta } from '@/core/config/app.config'

const HERO_VIDEO = heroV1

const isMuted = ref(true)
const showHeroContent = ref(true)
const videoRef = ref<HTMLVideoElement | null>(null)

function scrollToNextSection() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}

function toggleMute() {
  isMuted.value = !isMuted.value
}

function toggleHeroContent() {
  showHeroContent.value = !showHeroContent.value
}

function handleScroll() {
  const isScrolled = window.scrollY > 50
  if (!videoRef.value) return
  if (isScrolled) {
    videoRef.value.pause()
  } else if (videoRef.value.paused) {
    videoRef.value.play().catch(() => { })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <section class="hero-section">
    <div class="hero-videos">
      <video ref="videoRef" :src="HERO_VIDEO" autoplay loop :muted="isMuted" playsinline />
    </div>

    <Transition name="hero-content">
      <div v-if="showHeroContent" class="hero-glass-wrapper">
        <div class="hero-glass">
          <div class="hero-content">
            <p class="hero-eyebrow">{{ appMeta.hero.eyebrow }}</p>
            <h1 class="hero-headline">{{ appMeta.hero.headline }}</h1>
            <p class="hero-subtitle">{{ appMeta.hero.subtitle }}</p>
            <button class="hero-cta" @click="scrollToNextSection">
              {{ appMeta.hero.cta }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <button class="toggle-content-button" aria-label="切换文字区域" @click="toggleHeroContent">
      <svg v-if="showHeroContent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="15" x2="12" y2="15" />
      </svg>
    </button>

    <button class="mute-button" :aria-label="isMuted ? '取消静音' : '静音'" @click="toggleMute">
      <svg v-if="isMuted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M19.07 4.93a10 10 0 010 14.14" />
        <path d="M15.54 8.46a5 5 0 010 7.07" />
      </svg>
    </button>
  </section>
</template>

<style lang="scss" scoped>
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

.hero-videos {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-videos video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-section::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.hero-glass-wrapper {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.hero-glass {
  max-width: 680px;
  width: calc(100% - 64px);
  padding: 48px 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  backdrop-filter: blur(32px) saturate(160%);
  -webkit-backdrop-filter: blur(32px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.hero-content {
  text-align: center;
  color: #ffffff;
}

.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 12px;
}

.hero-headline {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
}

.hero-subtitle {
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 32px;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #1d1d1f;
  background: #ffffff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}

.mute-button {
  position: absolute;
  bottom: 24px;
  right: 24px;
  z-index: 3;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.toggle-content-button {
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 3;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.hero-content-enter-active {
  transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1), transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-content-leave-active {
  transition: opacity 300ms ease-in, transform 300ms ease-in;
}

.hero-content-enter-from {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
}

.hero-content-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.hero-content-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.hero-content-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}

@media (max-width: 760px) {
  .hero-glass {
    width: calc(100% - 32px);
    padding: 36px 28px;
    border-radius: 18px;
  }

  .hero-headline {
    font-size: clamp(2rem, 8vw, 3rem);
  }

  .hero-subtitle {
    font-size: 0.95rem;
  }

  .mute-button {
    bottom: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }

  .toggle-content-button {
    bottom: 16px;
    left: 16px;
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 560px) {
  .hero-glass {
    width: calc(100% - 16px);
    padding: 28px 20px;
    border-radius: 14px;
  }

  .hero-cta {
    width: 100%;
  }

  .mute-button {
    bottom: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }

  .toggle-content-button {
    bottom: 12px;
    left: 12px;
    width: 32px;
    height: 32px;
  }
}
</style>