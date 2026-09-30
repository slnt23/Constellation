package com.relax.owl.user.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.relax.owl.api.domain.dto.PageDTO;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(name = "博客文章分页查询参数")
public class BlogPostQueryDTO extends PageDTO {

    @Schema(description = "是否包含草稿")
    private Boolean includeDraft;
}