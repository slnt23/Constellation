package com.relax.owl.admin.service;

import com.baomidou.mybatisplus.spring.service.IService;
import com.relax.owl.admin.domain.dto.MenuItemDTO;
import com.relax.owl.admin.domain.entity.MenuItemDO;
import com.relax.owl.admin.domain.vo.MenuItemVO;
import com.relax.owl.common.result.ResultPage;

import java.util.List;

/**
 * 菜单项业务接口。
 *
 * @author slnt23
 * @since 2026/10/4
 */
public interface MenuItemService extends IService<MenuItemDO> {

    /**
     * 查询全部启用的菜单项，按排序升序，供前台菜单面板使用。
     *
     * @return 启用中的菜单项，无数据时返回空列表
     */
    List<MenuItemVO> listEnabled();

    /**
     * 分页查询全部菜单项，按 sort_order 升序。
     */
    ResultPage<MenuItemVO> page(long pageNum, long pageSize);

    /**
     * 查询单条详情，URL 已预签名。
     */
    MenuItemVO getById(Long id);

    /**
     * 新增菜单项。
     *
     * @return 受影响行数，1 表示新增成功
     */
    int create(MenuItemDTO dto);

    /**
     * 更新菜单项；未重新上传配图时保留原图。
     *
     * @return 是否更新成功
     */
    Boolean update(MenuItemDTO dto);

    /**
     * 删除菜单项，同时清理对象存储中的配图文件。
     *
     * @return 是否删除成功
     */
    Boolean deleteById(Long id);

    /**
     * 启用/禁用菜单项。
     *
     * @param status 1=启用，0=禁用
     * @return 是否操作成功
     */
    Boolean updateStatus(Long id, Integer status);
}
