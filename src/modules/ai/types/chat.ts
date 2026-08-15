export interface AiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AiConversation {
  id: string
  title: string
  preview: string
  timestamp: Date
}
