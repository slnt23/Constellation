package com.relax.owl.admin.convert;


import org.mapstruct.Mapper;
import com.relax.owl.admin.domain.entity.UserDO;
import com.relax.owl.admin.domain.vo.AdminUserVO;

import java.util.List;

/**
 * 后台用户管理 MapStruct
 *
 * @author slnt23
 * @since 2026/8/14
 */
@Mapper(componentModel = "spring")
public interface UserAdminConvert {

    AdminUserVO toVO(UserDO userDO);

    List<AdminUserVO> toVO(List<UserDO> userDOS);
}
