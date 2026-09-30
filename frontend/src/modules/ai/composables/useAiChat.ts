import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { AiConversation, AiMessage, ConversationVO, MessageVO } from '@/modules/ai/types'
import {
  createConversationApi,
  deleteConversationApi,
  getMessagesApi,
  listConversationsApi,
  sendChatStreamApi,
} from '@/modules/ai/api'

export function useAiChat() {
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

  return {
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
  }
}
