package com.relax.owl.admin.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * Hero 视频新增/更新请求模型，以 multipart/form-data 提交。
 *
 * <p>video 在新增时必传、更新时可省略（省略表示保留原视频），
 * 因此这里不加 {@code @NotNull}，改由 service 按场景校验。
 * poster 始终可选。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Data
@Schema(name = "Hero视频DTO")
public class HeroVideoDTO {

    /** 新增时不传，修改时必传 */
    @Schema(description = "ID，新增时不传，修改时必传", example = "1")
    private Long id;

    @NotBlank(message = "视频标题不能为空")
    @Size(max = 200, message = "视频标题长度不能超过200个字符")
    @Schema(description = "视频标题/标识", example = "首页主视觉", maxLength = 200)
    private String title;

    @Schema(type = "string", format = "binary", description = "视频文件，新增必传，更新可省略")
    private MultipartFile video;

    @Schema(type = "string", format = "binary", description = "封面图文件，可省略")
    private MultipartFile poster;

    @Min(value = 0, message = "排序序号不能小于0")
    @Max(value = 9999, message = "排序序号不能大于9999")
    @Schema(description = "排序序号，数值越小越靠前", example = "1", minimum = "0", maximum = "9999")
    private Integer sortOrder;

    @Min(value = 0, message = "状态只能为0或1")
    @Max(value = 1, message = "状态只能为0或1")
    @Schema(description = "状态：1=启用，0=禁用", example = "1")
    private Integer status;

    @Size(max = 500, message = "备注长度不能超过500个字符")
    @Schema(description = "备注", maxLength = 500)
    private String remark;
}
