import request from '@/core/api/request'
import type { ChatRequestDTO } from '@/modules/ai/types'
import type { Result } from '@/shared/types'
import { TOKEN_STORAGE_KEY } from '@/shared/constants'

/** 发送聊天消息（普通请求，返回完整回复） — POST /ai/chat */
export const sendChatApi = (data: ChatRequestDTO): Promise<Result<string>> => {
  return request.post('/ai/chat', data)
}

/**
 * 发送聊天消息（流式） — POST /ai/chat/stream
 * 后端返回 SSE（text/event-stream），按事件流解析回复片段
 */
export const sendChatStreamApi = (
  data: ChatRequestDTO,
  onMessage: (text: string) => void
): Promise<void> => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetch('/api/ai/chat/stream', {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  }).then(async response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const reader = response.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        if (buffer.trim()) {
          const text = parseSSEBuffer(buffer)
          if (text) onMessage(text)
        }
        break
      }
      buffer += decoder.decode(value, { stream: true })
      // 提取所有完整的 SSE 事件（以 \n\n 分隔）
      const parts = buffer.split('\n\n')
      // 保留最后一个不完整的事件
      buffer = parts.pop() || ''
      for (const part of parts) {
        const text = parseSSEChunk(part)
        if (text) onMessage(text)
      }
    }
  })
}

/** 解析单个 SSE 事件块，提取 data: 行的内容 */
function parseSSEChunk(chunk: string): string {
  const lines = chunk.split('\n')
  const dataLines: string[] = []
  for (const line of lines) {
    if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).replace(/^ /, ''))
    }
  }
  return dataLines.join('')
}

/** 解析缓冲区中可能不完整的 SSE 数据 */
function parseSSEBuffer(buffer: string): string {
  return buffer
    .split('\n')
    .filter(line => line.startsWith('data:'))
    .map(line => line.slice(5).replace(/^ /, ''))
    .join('')
}

