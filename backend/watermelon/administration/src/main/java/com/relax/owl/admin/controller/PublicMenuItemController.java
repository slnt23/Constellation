package com.relax.owl.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.relax.owl.admin.domain.vo.MenuItemVO;
import com.relax.owl.admin.service.MenuItemService;
import com.relax.owl.common.result.Result;

import java.util.List;

/**
 * 前台菜单公开读接口，免登录访问。
 *
 * <p>路径命中 SecurityConfig 中已有的 {@code /api/public/**} 白名单。
 * 菜单面板本身仅登录后可打开，此处保持公开形态是为了与 hero 接口一致。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@RestController
@RequestMapping("/api/public/menu-item")
@RequiredArgsConstructor
@Tag(name = "菜单项公开接口")
public class PublicMenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping("/list")
    @Operation(summary = "获取启用的菜单项列表",
            description = "按 sort_order 升序返回所有启用中的菜单项，无数据时返回空列表")
    public Result<List<MenuItemVO>> list() {
        return Result.success(menuItemService.listEnabled());
    }
}
