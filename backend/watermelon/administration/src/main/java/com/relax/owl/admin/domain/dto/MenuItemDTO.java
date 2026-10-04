package com.relax.owl.admin.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

/**
 * 菜单项新增/更新请求模型，以 multipart/form-data 提交。
 *
 * <p>image 在新增时必传、更新时可省略（省略表示保留原配图），
 * 因此这里不加 {@code @NotNull}，改由 service 按场景校验。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Data
@Schema(name = "菜单项DTO")
public class MenuItemDTO {

    /** 新增时不传，修改时必传 */
    @Schema(description = "ID，新增时不传，修改时必传", example = "1")
    private Long id;

    @NotBlank(message = "菜单标题不能为空")
    @Size(max = 100, message = "菜单标题长度不能超过100个字符")
    @Schema(description = "菜单标题", example = "价格行情", maxLength = 100)
    private String title;

    @Size(max = 200, message = "菜单副标题长度不能超过200个字符")
    @Schema(description = "菜单副标题", example = "查看最新价格与走势", maxLength = 200)
    private String subtitle;

    @NotBlank(message = "跳转路由不能为空")
    @Size(max = 200, message = "跳转路由长度不能超过200个字符")
    @Schema(description = "跳转的前端路由", example = "/price-query", maxLength = 200)
    private String path;

    @Schema(type = "string", format = "binary", description = "菜单配图文件，新增必传，更新可省略")
    private MultipartFile image;

    @Pattern(regexp = "large|normal|small", message = "卡片尺寸只能是 large、normal 或 small")
    @Schema(description = "卡片尺寸：large/normal/small", example = "normal")
    private String cardSize;

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
