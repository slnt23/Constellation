package com.relax.owl.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import com.relax.owl.admin.domain.entity.MenuItemDO;

import java.util.List;

/**
 * 菜单项 Mapper。
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Mapper
public interface MenuItemMapper extends BaseMapper<MenuItemDO> {

    /**
     * 查询全部启用的菜单项，按排序升序。
     *
     * @return 启用中的菜单项列表，无数据时返回空列表
     */
    List<MenuItemDO> selectEnabled();
}
