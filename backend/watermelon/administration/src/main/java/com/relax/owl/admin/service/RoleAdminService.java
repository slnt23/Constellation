package com.relax.owl.admin.service;

import com.baomidou.mybatisplus.spring.service.IService;
import com.relax.owl.admin.domain.dto.RoleCreateDTO;
import com.relax.owl.admin.domain.dto.RoleUpdateDTO;
import com.relax.owl.admin.domain.vo.RoleVO;
import com.relax.owl.api.domain.entity.RoleDO;

import java.util.List;

/**
 * <p>
 * 角色表 服务类
 * </p>
 *
 * @author slnt23
 * @since 2026-04-13 23:53:18
 */
public interface RoleAdminService extends IService<RoleDO> {

    List<RoleVO> listAll();

    RoleVO getById(Long id);

    Long create(RoleCreateDTO createDTO);

    Boolean update(Long id, RoleUpdateDTO updateDTO);

    Boolean deleteById(Long id);

    Boolean updateEnabled(Long id, Boolean enabled);

}
