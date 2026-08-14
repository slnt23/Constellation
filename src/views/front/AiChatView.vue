<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ChatSidebar from '@/components/ai/ChatSidebar.vue'
import ChatStream from '@/components/ai/ChatStream.vue'
import ChatComposer from '@/components/ai/ChatComposer.vue'
import { type AiMessage, type AiConversation } from '@/constant'
// import {
//   AI_MOCK_CONVERSATIONS,
//   AI_MOCK_MESSAGE_MAP,
//   AI_NEW_CONVERSATION_WELCOME,
//   buildMockReply,
// } from '@/constant'
import {
  sendChatStreamApi,
  createConversationApi,
  listConversationsApi,
  getMessagesApi,
  deleteConversationApi,
} from '@/api/modules/ai.api'
import type { ConversationVO, MessageVO } from '@/types'

const inputValue = ref('')
const isTyping = ref(false)
const activeConversationId = ref('')
const conversations = ref<AiConversation[]>([])
const messageMap = ref<Record<string, AiMessage[]>>({})

const activeMessages = computed(() => messageMap.value[activeConversationId.value] || [])

const mapConversation = (vo: ConversationVO): AiConversation => ({
  id: vo.id,
  title: vo.title,
  preview: '',
  timestamp: new Date(vo.updateTime),
})

const mapMessage = (vo: MessageVO): AiMessage => ({
  id: String(vo.id),
  role: vo.role === 'system' ? 'assistant' : vo.role,
  content: vo.content,
  timestamp: new Date(vo.createTime),
})

const loadConversations = async () => {
  try {
    const res = await listConversationsApi()
    conversations.value = (res.data || [])
      .map(mapConversation)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  } catch (e) {
    console.error('加载会话列表失败:', e)
  }
}

const loadMessages = async (conversationId: string) => {
  try {
    const res = await getMessagesApi(conversationId)
    messageMap.value[conversationId] = (res.data || []).map(mapMessage)
  } catch (e) {
    console.error('加载消息失败:', e)
    messageMap.value[conversationId] = []
  }
}

const createConversation = async () => {
  try {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const title = `${now.getMonth() + 1}月${now.getDate()}日 ${pad(now.getHours())}:${pad(now.getMinutes())}`
    const res = await createConversationApi({ title })
    const newId = res.data
    await loadConversations()
    activeConversationId.value = newId
    messageMap.value[newId] = []
  } catch (e) {
    console.error('创建会话失败:', e)
  }
}

const sendMessage = async () => {
  const text = inputValue.value.trim()
  if (!text || isTyping.value || !activeConversationId.value) return

  const conversationId = activeConversationId.value
  const userMessage: AiMessage = {
    id: `${Date.now()}-u`,
    role: 'user',
    content: text,
    timestamp: new Date(),
  }

  messageMap.value[conversationId] = [...(messageMap.value[conversationId] || []), userMessage]
  conversations.value = conversations.value.map((item) =>
    item.id === conversationId
      ? {
          ...item,
          preview: text.length > 26 ? `${text.slice(0, 26)}...` : text,
          timestamp: new Date(),
        }
      : item,
  )

  inputValue.value = ''
  isTyping.value = true

  const aiMessageId = `${Date.now()}-a`
  let aiContent = ''
  let isFirstChunk = true

  sendChatStreamApi({ conversationId, message: text }, (chunk) => {
    aiContent += chunk
    if (isFirstChunk) {
      isFirstChunk = false
      isTyping.value = false
      messageMap.value[conversationId] = [
        ...(messageMap.value[conversationId] || []),
        {
          id: aiMessageId,
          role: 'assistant',
          content: aiContent,
          timestamp: new Date(),
        },
      ]
    } else {
      const msgs = messageMap.value[conversationId] || []
      const idx = msgs.findIndex((m) => m.id === aiMessageId)
      if (idx !== -1) {
        const updated = [...msgs]
        updated[idx] = { ...updated[idx], content: aiContent }
        messageMap.value[conversationId] = updated
      }
    }
  })
    .catch((e) => {
      console.error('发送消息失败:', e)
      if (isFirstChunk) {
        isTyping.value = false
      }
    })
    .finally(() => {
      isTyping.value = false
    })
}

const selectConversation = (id: string) => {
  activeConversationId.value = id
  if (!messageMap.value[id]) {
    loadMessages(id)
  }
}

const loadHistory = () => {
  if (activeConversationId.value) {
    loadMessages(activeConversationId.value)
  }
}

const deleteConversation = async (id: string) => {
  try {
    await deleteConversationApi(id)
    delete messageMap.value[id]
    if (activeConversationId.value === id) {
      activeConversationId.value = ''
    }
    await loadConversations()
  } catch (e) {
    console.error('删除会话失败:', e)
  }
}

onMounted(() => {
  document.body.classList.add('body-ai-lock')
  loadConversations().then(() => {
    if (conversations.value.length > 0 && !activeConversationId.value) {
      selectConversation(conversations.value[0].id)
    }
  })
})

onBeforeUnmount(() => {
  document.body.classList.remove('body-ai-lock')
})
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
