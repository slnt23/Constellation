package com.relax.owl.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.relax.owl.admin.domain.vo.HeroVideoVO;
import com.relax.owl.admin.service.HeroVideoService;
import com.relax.owl.common.result.Result;

/**
 * 首页 Hero 视频公开读接口，免登录访问。
 *
 * <p>路径命中 SecurityConfig 中已有的 {@code /api/public/**} 白名单，
 * 因此匿名访客打开首页即可获取视频。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@RestController
@RequestMapping("/api/public/hero-video")
@RequiredArgsConstructor
@Tag(name = "Hero视频公开接口")
public class PublicHeroVideoController {

    private final HeroVideoService heroVideoService;

    @GetMapping("/active")
    @Operation(summary = "获取当前生效的 Hero 视频",
            description = "返回启用中且排序最靠前的一条，没有启用记录时 data 为 null")
    public Result<HeroVideoVO> active() {
        return Result.success(heroVideoService.getActive());
    }
}
