<script setup lang="ts">
import ChatSidebar from '@/modules/ai/components/ChatSidebar.vue'
import ChatStream from '@/modules/ai/components/ChatStream.vue'
import ChatComposer from '@/modules/ai/components/ChatComposer.vue'
import { useAiChat } from '@/modules/ai/composables'

const {
  inputValue,
  isTyping,
  activeConversationId,
  conversations,
  activeMessages,
  createConversation,
  selectConversation,
  loadHistory,
  deleteConversation,
  sendMessage,
} = useAiChat()
</script>

<template>
  <div class="chat-page">
    <section class="chat-workspace">
      <ChatSidebar
        :conversations="conversations"
        :active-conversation-id="activeConversationId"
        @create="createConversation"
        @select="selectConversation"
        @delete="deleteConversation"
      />

      <div v-if="!activeConversationId" class="chat-workspace__empty">
        <p>选择或创建一个会话开始聊天</p>
      </div>

      <div v-else class="chat-workspace__main">
        <div class="chat-workspace__title">
          <span>{{ conversations.find((item) => item.id === activeConversationId)?.title || '新会话' }}</span>
          <button type="button" class="chat-workspace__load-history" title="加载历史消息" @click="loadHistory">↑</button>
        </div>

        <div class="chat-workspace__messages u-scrollbar-hidden">
          <ChatStream :messages="activeMessages" :is-typing="isTyping" />
        </div>

        <div class="chat-workspace__composer">
          <ChatComposer
            v-model="inputValue"
            :disabled="!inputValue.trim() || isTyping"
            @send="sendMessage"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.chat-page {
  height: 100vh;
  padding: var(--chat-edge-gap);
  overflow: hidden;
  background-color: #faf9f5;
  /* {colors.canvas} */
}

.chat-workspace {
  height: 100%;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  border: 1px solid #e6dfd8;
  /* {colors.hairline} */
  border-radius: 12px;
  /* {rounded.lg} */
  overflow: hidden;
  background: #ffffff;
}

.chat-workspace__main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 0;
  border-left: 1px solid #e6dfd8;
  /* {colors.hairline} */
}

.chat-workspace__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #e6dfd8;
  /* {colors.hairline} */
  color: #141413;
  /* {colors.ink} */
  font-family: 'StyreneB', 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
}

.chat-workspace__load-history {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e6dfd8;
  border-radius: 8px;
  background: #faf9f5;
  color: #6c6a64;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.chat-workspace__load-history:hover {
  background: #e6dfd8;
  color: #141413;
}

.chat-workspace__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  border-left: 1px solid #e6dfd8;
  color: #8e8b82;
  font-size: 15px;
}

.chat-workspace__messages {
  min-height: 0;
  overflow: auto;
  padding: 24px;
  /* {spacing.lg} */
  background-color: #faf9f5;
  /* {colors.canvas} */
}

.chat-workspace__composer {
  padding: 16px;
  /* {spacing.md} */
  border-top: 1px solid #e6dfd8;
  /* {colors.hairline} */
  background-color: #ffffff;
}

@media (max-width: 1024px) {
  .chat-workspace {
    grid-template-columns: 220px minmax(0, 1fr);
  }
}

@media (max-width: 768px) {
  .chat-workspace {
    grid-template-columns: 1fr;
  }

  .chat-workspace__main {
    border-left: none;
    border-top: 1px solid #e6dfd8;
    /* {colors.hairline} */
  }

  .chat-page {
    padding-top: calc(var(--site-header-offset) + var(--site-header-height) + var(--chat-nav-gap));
  }

  .chat-workspace__messages {
    padding: 16px;
    /* {spacing.md} */
  }
}
</style>
