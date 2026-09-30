package com.relax.owl.admin.service.impl;

import com.relax.owl.log.domain.entity.AdminLogDO;
import com.relax.owl.admin.mapper.LogAdminMapper;
import com.relax.owl.admin.service.LogAdminService;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 管理员操作日志表 服务实现类
 * </p>
 *
 * @author slnt23
 * @since 2026-04-13 23:53:18
 */
@Service
public class LogAdminServiceImpl extends ServiceImpl<LogAdminMapper, AdminLogDO> implements LogAdminService {

}
