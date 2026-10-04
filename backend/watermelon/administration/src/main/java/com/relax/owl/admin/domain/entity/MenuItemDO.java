package com.relax.owl.admin.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 前台菜单项实体，对应表 admin_menu_item。
 *
 * <p>imageUrl 中存放的是对象存储里的裸对象 key，
 * 读取时由 service 通过 FileStorageService 转换为预签名 URL 后再返回。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Getter
@Setter
@ToString
@TableName("admin_menu_item")
@Schema(name = "MenuItemDO对象", description = "前台菜单项表")
public class MenuItemDO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键ID，唯一标识")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "菜单标题")
    @TableField("title")
    private String title;

    @Schema(description = "菜单副标题")
    @TableField("subtitle")
    private String subtitle;

    @Schema(description = "跳转的前端路由")
    @TableField("path")
    private String path;

    @Schema(description = "菜单配图对象存储路径，存放裸对象 key")
    @TableField("image_url")
    private String imageUrl;

    @Schema(description = "卡片尺寸：large/normal/small")
    @TableField("card_size")
    private String cardSize;

    @Schema(description = "排序序号，数值越小越靠前")
    @TableField("sort_order")
    private Integer sortOrder;

    @Schema(description = "状态：1=启用，0=禁用")
    @TableField("status")
    private Integer status;

    @Schema(description = "备注")
    @TableField("remark")
    private String remark;

    @Schema(description = "创建时间")
    @TableField("create_time")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    @TableField("update_time")
    private LocalDateTime updateTime;
}
