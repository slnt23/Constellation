package com.relax.owl.admin.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 菜单项视图对象，前台菜单面板与后台列表共用。
 *
 * <p>imageUrl 是预签名后的可直接访问 URL，不是数据库中的裸对象 key。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Data
@Schema(name = "菜单项VO")
public class MenuItemVO {

    @Schema(description = "菜单项ID")
    private Long id;

    @Schema(description = "菜单标题", example = "价格行情")
    private String title;

    @Schema(description = "菜单副标题", example = "查看最新价格与走势")
    private String subtitle;

    @Schema(description = "跳转的前端路由", example = "/price-query")
    private String path;

    @Schema(description = "菜单配图预签名访问URL")
    private String imageUrl;

    @Schema(description = "卡片尺寸：large/normal/small", example = "normal")
    private String cardSize;

    @Schema(description = "排序序号，数值越小越靠前", example = "1")
    private Integer sortOrder;

    @Schema(description = "状态：1=启用，0=禁用", example = "1")
    private Integer status;

    @Schema(description = "备注")
    private String remark;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
}
