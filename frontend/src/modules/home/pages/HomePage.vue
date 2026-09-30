<script setup lang="ts">
import { HOME_SECTION_INTROS } from '@/modules/home/constants'
import FeatureGrid from '@/modules/home/components/FeatureGrid.vue'
import HeroSection from '@/modules/home/components/HeroSection.vue'
import SectionIntro from '@/modules/home/components/SectionIntro.vue'
import SpotlightSection from '@/modules/home/components/SpotlightSection.vue'
import { onMounted, ref } from 'vue'
import { featureApi, spotlightApi } from '@/modules/admin/api'
import type { SpotlightItem, FeatureItem } from '@/shared/types'

const spotlightItems = ref<SpotlightItem[]>([])
const featureItems = ref<FeatureItem[]>([])

const loading = ref(true)

const fetchData = async () => {
  try {
    loading.value = true

    const [spotlightResponse, featureResponse] = await Promise.all([
      spotlightApi.list(),
      featureApi.list(),
    ])

    if (spotlightResponse.code === 200) {
      spotlightItems.value = spotlightResponse.data
    }

    if (featureResponse.code === 200) {
      featureItems.value = featureResponse.data
    }
  } catch (error) {
    console.error('获取焦点数据，特性数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="front-page">
    <section>
      <HeroSection />
    </section>

    <section class="content-section content-stack">
      <SectionIntro v-bind="HOME_SECTION_INTROS[0]" />
      <SpotlightSection :items="spotlightItems" />
    </section>

    <section class="content-section content-stack">
      <SectionIntro v-bind="HOME_SECTION_INTROS[1]" />
      <FeatureGrid :items="featureItems" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.front-page {
  display: grid;
  gap: var(--theme-section-gap);
  background: var(--theme-canvas);
}

@media (max-width: 760px) {
  .front-page {
    gap: 48px;
  }
}
</style>