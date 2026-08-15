<script setup lang="ts">

import { FRONT_MENU_ITEMS } from '@/shared/constants'
import { EXAMPLE_HOME_STATS, HOME_SECTION_INTROS } from '@/modules/home/constants'
import FeatureGrid from '@/modules/home/components/FeatureGrid.vue'
import SectionIntro from '@/modules/home/components/SectionIntro.vue'
import SpotlightSection from '@/modules/home/components/SpotlightSection.vue'
import StatsSection from '@/modules/home/components/StatsSection.vue'
import CTASection from '@/modules/home/components/CTASection.vue'
import { onMounted, ref } from "vue";
import { featureApi, spotlightApi } from "@/modules/admin/api";
import type { SpotlightItem, FeatureItem } from "@/shared/types";

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

    <StatsSection :items="EXAMPLE_HOME_STATS" />

    <section class="content-section content-stack">
      <SectionIntro v-bind="HOME_SECTION_INTROS[0]" />
      <SpotlightSection :items="spotlightItems" />
    </section>

    <section class="content-section content-stack">
      <SectionIntro v-bind="HOME_SECTION_INTROS[1]" />
      <FeatureGrid :items="featureItems" />
    </section>

    <section class="content-section content-stack">
      <SectionIntro v-bind="HOME_SECTION_INTROS[2]" />
      <CTASection :items="FRONT_MENU_ITEMS" />
    </section>
  </div>
</template>

<style scoped lang="scss">
.front-page {
  display: grid;
  gap: var(--vercel-section-gap);
  background: var(--vercel-canvas-soft);
}

@media (max-width: 760px) {
  .front-page {
    gap: 48px;
  }
}
</style>
