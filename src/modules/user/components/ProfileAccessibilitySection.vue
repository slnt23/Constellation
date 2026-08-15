<script setup lang="ts">
import type { ProfileCardExample } from '@/shared/types'

defineProps<{
  cards: ProfileCardExample[]
}>()
</script>

<template>
  <section class="profile-stack">
    <article v-for="card in cards" :key="card.title" class="profile-card">
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
    </article>
  </section>
</template>

<style scoped lang="scss">
.profile-stack {
  display: grid;
  gap: 16px;
}

.profile-card {
  padding: 24px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #ebebeb;
}

.profile-card h3 {
  margin: 0 0 8px;
  color: #171717;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.profile-card p {
  margin: 0;
  color: #4d4d4d;
  font-size: 14px;
  line-height: 20px;
}
</style>