/** 发送消息 — ChatRequestDTO */
export interface ChatRequestDTO {
  conversationId: string
  message: string
}

/** 创建会话 — CreateConversationDTO */
export interface CreateConversationDTO {
  title?: string
}

/** 会话列表项 — ConversationVO */
export interface ConversationVO {
  id: string
  title: string
  createTime: string
  updateTime: string
}

/** 历史消息 — MessageVO */
export interface MessageVO {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  createTime: string
}
