package com.relax.owl.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.relax.owl.common.result.Result;
import com.relax.owl.common.security.CurrentUserContext;
import com.relax.owl.user.domain.dto.BlogSettingsDTO;
import com.relax.owl.user.domain.vo.BlogSettingsVO;
import com.relax.owl.user.service.BlogSettingsService;

@RestController
@RequestMapping("/api/blog/settings")
@RequiredArgsConstructor
@Tag(name = "博客设置")
public class BlogSettingsController {

    private final BlogSettingsService blogSettingsService;

    @GetMapping
    @Operation(summary = "获取博客设置")
    public Result<BlogSettingsVO> get() {
        Long userId = CurrentUserContext.getUserId();
        return Result.success(blogSettingsService.get(userId));
    }

    @PutMapping
    @Operation(summary = "更新博客设置")
    public Result<Void> update(@RequestBody BlogSettingsDTO dto) {
        Long userId = CurrentUserContext.getUserId();
        return blogSettingsService.update(dto, userId) ? Result.success() : Result.fail();
    }
}