<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { AiMessage } from '@/modules/ai/types'

const props = defineProps<{
  messages: AiMessage[]
  isTyping: boolean
}>()

function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string
}
</script>

<template>
  <div class="chat-stream">
    <article v-for="message in messages" :key="message.id" class="chat-stream__item"
      :class="{ 'chat-stream__item--user': message.role === 'user' }">
      <div class="chat-stream__meta">{{ message.role === 'user' ? '你' : 'AI' }}</div>
      <div
        class="chat-stream__content"
        :class="{ 'chat-stream__content--md': message.role === 'assistant' }"
        v-html="message.role === 'assistant' ? renderMarkdown(message.content) : message.content"
      ></div>
      <div class="chat-stream__time">
        {{
          message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </div>
    </article>

    <article v-if="isTyping" class="chat-stream__item">
      <div class="chat-stream__meta">AI</div>
      <div class="chat-stream__typing">
        <span />
        <span />
        <span />
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.chat-stream {
  display: grid;
  gap: 24px;
  /* {spacing.lg} */
}

.chat-stream__item {
  max-width: min(85%, 720px);
  display: grid;
  gap: 8px;
  /* {spacing.xs} */
}

.chat-stream__item--user {
  justify-self: end;
  text-align: right;
}

.chat-stream__item--user .chat-stream__content {
  background: #cc785c;
  /* {colors.primary} */
  color: #ffffff;
  /* {colors.on-primary} */
}

.chat-stream__meta {
  color: #6c6a64;
  /* {colors.muted} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 1.4;
}

.chat-stream__content {
  padding: 16px 20px;
  /* {spacing.md} */
  border-radius: 12px;
  /* {rounded.lg} */
  background: #efe9de;
  /* {colors.surface-card} */
  color: #141413;
  /* {colors.ink} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 16px;
  line-height: 1.55;
}

.chat-stream__time {
  color: #8e8b82;
  /* {colors.muted-soft} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.4;
}

.chat-stream__content--md {
  :deep(p) {
    margin: 0 0 8px;
    &:last-child { margin-bottom: 0; }
  }

  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    margin: 12px 0 6px;
    font-weight: 600;
    line-height: 1.3;
    &:first-child { margin-top: 0; }
  }

  :deep(h1) { font-size: 20px; }
  :deep(h2) { font-size: 18px; }
  :deep(h3) { font-size: 16px; }

  :deep(ul), :deep(ol) {
    margin: 6px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin-bottom: 4px;
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
  }

  :deep(pre) {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 14px 18px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 10px 0;
    font-size: 13px;
    line-height: 1.5;

    code {
      background: none;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
      color: inherit;
    }
  }

  :deep(blockquote) {
    border-left: 3px solid #cc785c;
    margin: 8px 0;
    padding: 4px 14px;
    color: #6c6a64;
    font-style: italic;
  }

  :deep(a) {
    color: #cc785c;
    text-decoration: underline;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid var(--vercel-hairline);
    margin: 14px 0;
  }

  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 14px;
  }

  :deep(th), :deep(td) {
    border: 1px solid var(--vercel-hairline);
    padding: 8px 12px;
    text-align: left;
  }

  :deep(th) {
    background: rgba(0, 0, 0, 0.03);
    font-weight: 600;
  }

  :deep(strong) { font-weight: 600; }
  :deep(em) { font-style: italic; }
}

.chat-stream__typing {
  display: flex;
  align-items: center;
  gap: 8px;
  /* {spacing.xs} */
  min-height: 44px;
  padding: 12px 20px;
  /* {spacing.sm} */
  border-radius: 12px;
  /* {rounded.lg} */
  background: #efe9de;
  /* {colors.surface-card} */
}

.chat-stream__typing span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6c6a64;
  /* {colors.muted} */
  animation: typing-bounce 900ms infinite ease-in-out;
}

.chat-stream__typing span:nth-child(2) {
  animation-delay: 120ms;
}

.chat-stream__typing span:nth-child(3) {
  animation-delay: 240ms;
}

@keyframes typing-bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
</style>
