package com.relax.owl.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import com.relax.owl.user.domain.entity.BlogSettingsDO;

@Mapper
public interface BlogSettingsMapper extends BaseMapper<BlogSettingsDO> {
}