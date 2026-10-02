package com.relax.owl.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import com.relax.owl.admin.domain.entity.HeroVideoDO;

/**
 * Hero 视频 Mapper。
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Mapper
public interface HeroVideoMapper extends BaseMapper<HeroVideoDO> {

    /**
     * 查询当前生效的 Hero 视频：启用中且排序最靠前的一条。
     *
     * @return 生效视频，没有启用记录时返回 null
     */
    HeroVideoDO selectActive();
}
