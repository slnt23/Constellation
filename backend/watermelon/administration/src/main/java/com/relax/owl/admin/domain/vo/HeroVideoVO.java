package com.relax.owl.admin.domain.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Hero 视频视图对象，前台展示与后台列表共用。
 *
 * <p>videoUrl / posterUrl 是预签名后的可直接访问 URL，不是数据库中的裸对象 key。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Data
@Schema(name = "Hero视频VO")
public class HeroVideoVO {

    @Schema(description = "视频ID")
    private Long id;

    @Schema(description = "视频标题/标识", example = "首页主视觉")
    private String title;

    @Schema(description = "视频预签名访问URL")
    private String videoUrl;

    @Schema(description = "封面图预签名访问URL")
    private String posterUrl;

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
