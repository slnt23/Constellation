package com.relax.owl.crow.service;


import com.relax.owl.crow.domain.dto.CreateConversationDTO;
import com.relax.owl.crow.domain.vo.ConversationVO;
import com.relax.owl.crow.domain.vo.MessageVO;

import java.util.List;

/**
 * 会话管理
 *
 * @author slnt23
 * @since 2026/4/12
 */

public interface ConversationService {

    /**
     * 创建会话ID，
     *
     * @param dto
     * @return
     */
    String createConversation(CreateConversationDTO dto);

    /**
     * 获取当前用户的会话列表
     *
     * @return
     */
    List<ConversationVO> listCurrentUserConversations();

    /**
     * 获取会话消息列表
     *
     * @param conversationId
     * @return
     */
    List<MessageVO> getMessages(String conversationId);

    /**
     * 删除会话
     *
     * @param conversationId
     */
    void deleteConversation(String conversationId);
}
