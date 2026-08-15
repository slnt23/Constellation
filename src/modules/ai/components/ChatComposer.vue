<script setup lang="ts">
defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
}>()

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('send')
  }
}
</script>

<template>
  <form class="chat-composer" @submit.prevent="emit('send')">
    <textarea :value="modelValue" rows="1" placeholder="输入消息..."
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)" @keydown="onKeydown" />
    <button type="submit" :disabled="disabled">发送</button>
  </form>
</template>

<style scoped lang="scss">
.chat-composer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  /* {spacing.sm} */
  align-items: end;
}

.chat-composer textarea {
  min-height: 48px;
  max-height: 160px;
  padding: 10px 14px;
  /* {typography.body-md} */
  border: 1px solid #e6dfd8;
  /* {colors.hairline} */
  border-radius: 8px;
  /* {rounded.md} */
  background: #faf9f5;
  /* {colors.canvas} */
  color: #141413;
  /* {colors.ink} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.55;
  resize: vertical;
  outline: none;
}

.chat-composer textarea:focus {
  border-color: #cc785c;
  /* {colors.primary} */
  box-shadow: 0 0 0 3px rgba(204, 120, 92, 0.15);
}

.chat-composer textarea::placeholder {
  color: #8e8b82;
  /* {colors.muted-soft} */
}

.chat-composer button {
  min-width: 88px;
  height: 40px;
  /* {component.button-primary} */
  padding: 12px 20px;
  /* {component.button-primary} */
  border-radius: 8px;
  /* {rounded.md} */
  background: #cc785c;
  /* {colors.primary} */
  color: #ffffff;
  /* {colors.on-primary} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
}

.chat-composer button:hover:not(:disabled) {
  background: #a9583e;
  /* {colors.primary-active} */
}

.chat-composer button:disabled {
  background: #e6dfd8;
  /* {colors.primary-disabled} */
  color: #6c6a64;
  /* {colors.muted} */
  cursor: not-allowed;
}
</style>