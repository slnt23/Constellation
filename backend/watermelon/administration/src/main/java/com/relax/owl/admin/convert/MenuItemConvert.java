package com.relax.owl.admin.convert;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.relax.owl.admin.domain.dto.MenuItemDTO;
import com.relax.owl.admin.domain.entity.MenuItemDO;
import com.relax.owl.admin.domain.vo.MenuItemVO;

import java.util.List;

/**
 * 菜单项 DO / DTO / VO 转换器。
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Mapper(componentModel = "spring")
public interface MenuItemConvert {

    /** DO 转 VO，调用前 imageUrl 已被替换为预签名 URL */
    MenuItemVO DOConvertVO(MenuItemDO menuItemDO);

    List<MenuItemVO> DOConvertVO(List<MenuItemDO> menuItemDOS);

    /**
     * id 由数据库自增维护；imageUrl 由 service 上传文件后填充；
     * createTime / updateTime 由数据库维护，均忽略映射。
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "createTime", ignore = true)
    @Mapping(target = "updateTime", ignore = true)
    MenuItemDO DTOConvertDO(MenuItemDTO menuItemDTO);
}
