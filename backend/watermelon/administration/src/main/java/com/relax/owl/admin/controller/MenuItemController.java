package com.relax.owl.admin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.relax.owl.admin.domain.dto.MenuItemDTO;
import com.relax.owl.admin.domain.vo.MenuItemVO;
import com.relax.owl.admin.service.MenuItemService;
import com.relax.owl.common.result.Result;
import com.relax.owl.common.result.ResultPage;
import com.relax.owl.common.result.ResultStatus;

/**
 * 后台菜单项管理：列表、详情、新增、更新、删除、启停。
 *
 * <p>该前缀未列入 SecurityConfig 白名单，因此由 {@code /api/admin/**} 规则
 * 自动要求 ADMIN 角色，无需额外的注解或配置。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@RestController
@RequestMapping("/api/admin/menu-item")
@RequiredArgsConstructor
@Tag(name = "菜单项管理")
public class MenuItemController {

    private final MenuItemService menuItemService;

    @GetMapping("/page")
    @Operation(summary = "分页获取菜单项")
    public Result<ResultPage<MenuItemVO>> page(
            @RequestParam(defaultValue = "1") long pageNum,
            @RequestParam(defaultValue = "10") long pageSize) {
        return Result.success(menuItemService.page(pageNum, pageSize));
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取单条菜单项")
    public Result<MenuItemVO> getById(@PathVariable Long id) {
        return Result.success(menuItemService.getById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "新增菜单项")
    public Result<Integer> create(@Valid @ModelAttribute MenuItemDTO dto) {
        return Result.success(menuItemService.create(dto));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "更新菜单项", description = "不传 image 字段表示保留原配图")
    public Result<ResultStatus> update(@PathVariable Long id,
                                       @Valid @ModelAttribute MenuItemDTO dto) {
        dto.setId(id);
        if (menuItemService.update(dto)) {
            return Result.success();
        }
        return Result.fail();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除菜单项")
    public Result<ResultStatus> delete(@PathVariable Long id) {
        if (menuItemService.deleteById(id)) {
            return Result.success();
        }
        return Result.fail();
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "启用/禁用菜单项")
    public Result<ResultStatus> updateStatus(@PathVariable Long id,
                                             @RequestParam Integer status) {
        if (menuItemService.updateStatus(id, status)) {
            return Result.success();
        }
        return Result.fail();
    }
}
