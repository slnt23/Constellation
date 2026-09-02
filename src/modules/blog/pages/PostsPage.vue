<script setup lang="ts">
import BlogList from '@/modules/blog/components/BlogList.vue'
</script>

<template>
  <div class="blog-list-page">
    <BlogList />
  </div>
</template>

<style scoped lang="scss">
.blog-list-page {
  padding: 60px 0 80px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .blog-list-page {
    padding: 30px 0 60px;
  }
}
</style>
