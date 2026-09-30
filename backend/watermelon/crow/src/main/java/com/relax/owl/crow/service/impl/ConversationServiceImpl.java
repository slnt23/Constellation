package com.relax.owl.crow.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.relax.owl.crow.domain.dto.CreateConversationDTO;
import com.relax.owl.crow.domain.entity.ConversationDO;
import com.relax.owl.crow.mapper.ConversationMapper;
import com.relax.owl.crow.mapper.MessageMapper;
import com.relax.owl.crow.mapstruct.ConversationConvert;
import com.relax.owl.crow.service.ConversationService;
import com.relax.owl.crow.domain.vo.ConversationVO;
import com.relax.owl.crow.domain.vo.MessageVO;
import com.relax.owl.log.annotation.OperationLog;
import com.relax.owl.common.security.CurrentUserContext;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * 会话管理
 *
 * @author slnt23
 * @since 2026/4/12
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class ConversationServiceImpl implements ConversationService {

    private final ConversationMapper conversationMapper;
    private final MessageMapper messageMapper;
    private final ConversationConvert conversationConvert;


    @Override
    public String createConversation(CreateConversationDTO dto) {

        String conversationId = UUID.randomUUID().toString();

        log.info("conversationId:{}", conversationId);

        ConversationDO conversation = new ConversationDO();
        conversation.setId(conversationId);
        conversation.setTitle(dto != null ? dto.getTitle() : "新对话");
        conversation.setCreateTime(LocalDateTime.now());
        conversation.setUpdateTime(LocalDateTime.now());
//        获取用户账号，
        conversation.setUserCode(CurrentUserContext.getUserCode());

        log.info("conversationId:{}", conversation);

        conversationMapper.insert(conversation);

        return conversationId;
    }


    @Override
    public List<ConversationVO> listCurrentUserConversations() {

        String userCodeId = CurrentUserContext.getUserCode();

        LambdaQueryWrapper<ConversationDO> wrapper = new LambdaQueryWrapper<ConversationDO>();
        wrapper.eq(ConversationDO::getUserCode, userCodeId);

//        查询当前用户的会话列表
        List<ConversationDO> conversationDOS = conversationMapper.selectList(wrapper);

        return conversationConvert.conversationDOListToConversationVOList(conversationDOS);
    }


    @Override
    public List<MessageVO> getMessages(String conversationId) {
        return messageMapper.selectByConversationId(conversationId);
    }

    @Override
    @OperationLog(module = "ai-conversation", action = "删除本ai会话", persist = true)
    public void deleteConversation(String conversationId) {
        String userCode = CurrentUserContext.getUserCode();
        ConversationDO conversation = conversationMapper.selectOne(
                new LambdaQueryWrapper<ConversationDO>()
                        .eq(ConversationDO::getId, conversationId)
                        .eq(ConversationDO::getUserCode, userCode));
        if (conversation == null) {
            return;
        }
        conversationMapper.deleteById(conversationId);
    }
}

