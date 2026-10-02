package com.relax.owl.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.relax.owl.admin.domain.dto.HeroVideoDTO;
import com.relax.owl.admin.domain.vo.HeroVideoVO;
import com.relax.owl.admin.service.HeroVideoService;
import com.relax.owl.common.result.Result;
import com.relax.owl.common.result.ResultPage;
import com.relax.owl.common.result.ResultStatus;

/**
 * 后台 Hero 视频管理：列表、详情、新增、更新、删除、启停。
 *
 * <p>该前缀未列入 SecurityConfig 白名单，因此由 {@code /api/admin/**} 规则
 * 自动要求 ADMIN 角色，无需额外的注解或配置。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@RestController
@RequestMapping("/api/admin/hero-video")
@RequiredArgsConstructor
@Tag(name = "Hero视频管理")
public class HeroVideoController {

    private final HeroVideoService heroVideoService;

    @GetMapping("/page")
    @Operation(summary = "分页获取 Hero 视频")
    public Result<ResultPage<HeroVideoVO>> page(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(heroVideoService.page(pageNum, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取单条 Hero 视频")
    public Result<HeroVideoVO> getById(@PathVariable Long id) {
        return Result.success(heroVideoService.getById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "新增 Hero 视频")
    public Result<Integer> create(@Valid @ModelAttribute HeroVideoDTO dto) {
        return Result.success(heroVideoService.create(dto));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "更新 Hero 视频", description = "不传 video 字段表示保留原视频")
    public Result<ResultStatus> update(@PathVariable Long id,
                                       @Valid @ModelAttribute HeroVideoDTO dto) {
        dto.setId(id);
        if (heroVideoService.update(dto)) {
            return Result.success();
        }
        return Result.fail();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除 Hero 视频")
    public Result<ResultStatus> delete(@PathVariable Long id) {
        if (heroVideoService.deleteById(id)) {
            return Result.success();
        }
        return Result.fail();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用 Hero 视频")
    public Result<ResultStatus> updateStatus(@PathVariable Long id,
                                             @RequestParam Integer status) {
        if (heroVideoService.updateStatus(id, status)) {
            return Result.success();
        }
        return Result.fail();
    }
}
