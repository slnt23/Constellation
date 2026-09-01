<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <header class="section-intro">
    <div class="section-intro__eyebrow">
      <span class="section-intro__line" />
      <p class="eyebrow-label">{{ eyebrow }}</p>
    </div>
    <h2 class="section-intro__title">{{ title }}</h2>
    <p class="section-intro__body">{{ description }}</p>
  </header>
</template>

<style scoped lang="scss">
.section-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(720px, 100%);
  margin: 0 auto;
  text-align: center;

  &__eyebrow {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;

    .section-intro__line {
      width: 28px;
      height: 1px;
      background: var(--theme-border);
      opacity: 0.5;
    }

    .eyebrow-label {
      margin: 0;
      color: var(--theme-text-muted);
      font-family: 'Inter', 'Geist', system-ui, sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  }

  &__title {
    margin: 0;
    color: var(--theme-text);
    font-family: 'Inter', 'Geist', system-ui, sans-serif;
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.04em;
  }

  &__body {
    margin: 18px 0 0;
    max-width: 460px;
    color: var(--theme-text-regular);
    font-size: 1rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    &__title {
      font-size: 2rem;
    }

    &__body {
      max-width: 92%;
      line-height: 1.6;
    }
  }
}
</style>