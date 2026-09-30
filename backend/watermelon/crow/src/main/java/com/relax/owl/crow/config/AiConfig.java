package com.relax.owl.crow.config;


import io.minio.MinioClient;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.relax.owl.crow.constant.ChatClientProperties;
import com.relax.owl.crow.service.SkillRegistryService;
import com.relax.owl.crow.service.impl.MinioSkillRegistryService;

/**
 * 有关AI的
 *
 * @author slnt23
 * @since 2026/4/12
 */

@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder, ChatClientProperties properties) {
        return builder
                .defaultSystem(properties.getDefaultSystem())
                .build();
    }

    @Bean
    public SkillRegistryService skillRegistry(MinioClient minioClient) {
        return new MinioSkillRegistryService(minioClient);
    }
}