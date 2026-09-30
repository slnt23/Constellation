package com.relax.owl.sugarcane.service.impl;

import com.relax.owl.sugarcane.domain.entity.GeoLocationDO;
import com.relax.owl.sugarcane.mapper.GeoLocationMapper;
import com.relax.owl.sugarcane.service.GeoLocationService;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 地理位置表 服务实现类
 * </p>
 *
 * @author slnt23
 * @since 2026-04-12 20:43:32
 */
@Service
public class GeoLocationServiceImpl extends ServiceImpl<GeoLocationMapper, GeoLocationDO> implements GeoLocationService {

}
