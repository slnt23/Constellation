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
 * 首页 Hero 视频实体，对应表 admin_hero_video。
 *
 * <p>videoUrl / posterUrl 中存放的是对象存储里的裸对象 key，
 * 读取时由 service 通过 FileStorageService 转换为预签名 URL 后再返回。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Getter
@Setter
@ToString
@TableName("admin_hero_video")
@Schema(name = "HeroVideoDO对象", description = "首页 Hero 视频表")
public class HeroVideoDO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "主键ID，唯一标识")
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @Schema(description = "视频标题/标识")
    @TableField("title")
    private String title;

    @Schema(description = "视频对象存储路径，存放裸对象 key")
    @TableField("video_url")
    private String videoUrl;

    @Schema(description = "封面图对象存储路径，存放裸对象 key")
    @TableField("poster_url")
    private String posterUrl;

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
