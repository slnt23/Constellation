package com.relax.owl.admin.convert;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.relax.owl.admin.domain.dto.HeroVideoDTO;
import com.relax.owl.admin.domain.entity.HeroVideoDO;
import com.relax.owl.admin.domain.vo.HeroVideoVO;

import java.util.List;

/**
 * Hero 视频 DO / DTO / VO 转换器。
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Mapper(componentModel = "spring")
public interface HeroVideoConvert {

    /** DO 转 VO，调用前 videoUrl / posterUrl 已被替换为预签名 URL */
    HeroVideoVO DOConvertVO(HeroVideoDO heroVideoDO);

    List<HeroVideoVO> DOConvertVO(List<HeroVideoDO> heroVideoDOS);

    /**
     * id 由数据库自增维护；videoUrl / posterUrl 由 service 上传文件后填充；
     * createTime / updateTime 由数据库维护，均忽略映射。
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "videoUrl", ignore = true)
    @Mapping(target = "posterUrl", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    @Mapping(target = "updateTime", ignore = true)
    HeroVideoDO DTOConvertDO(HeroVideoDTO heroVideoDTO);
}
