import request from '@/core/api/request'
import type { ConversationVO, CreateConversationDTO, MessageVO } from '@/modules/ai/types'
import type { Result } from '@/shared/types'

/** 新建会话 */
export const createConversationApi = (data?: CreateConversationDTO): Promise<Result<string>> => {
  return request.post('/ai/conversation', data)
}

/** 获取会话历史列表 */
export const listConversationsApi = (): Promise<Result<ConversationVO[]>> => {
  return request.get('/ai/conversation/list')
}

/** 获取会话的历史消息 */
export const getMessagesApi = (conversationId: string): Promise<Result<MessageVO[]>> => {
  return request.get(`/ai/conversation/${conversationId}/messages`)
}

/** 删除会话 */
export const deleteConversationApi = (conversationId: string): Promise<Result<null>> => {
  return request.delete(`/ai/conversation/${conversationId}`)
}
