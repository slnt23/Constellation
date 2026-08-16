<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="admin-layout">
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
