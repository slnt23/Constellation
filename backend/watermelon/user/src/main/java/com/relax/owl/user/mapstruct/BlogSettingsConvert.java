package com.relax.owl.user.mapstruct;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.relax.owl.user.domain.entity.BlogSettingsDO;
import com.relax.owl.user.domain.vo.BlogAboutVO;

@Mapper(componentModel = "spring")
public interface BlogSettingsConvert {

    @Mapping(target = "bio", ignore = true)
    BlogAboutVO toAboutVO(BlogSettingsDO settings);
}