package com.relax.owl.admin.service;

import com.relax.owl.admin.domain.dto.FeatureDTO;
import com.relax.owl.admin.domain.entity.FeatureDO;
import com.baomidou.mybatisplus.spring.service.IService;
import com.relax.owl.admin.domain.vo.FeatureVO;
import com.relax.owl.common.result.ResultPage;

import java.util.List;

/**
 * <p>
 * 产品特性展示表 服务类
 * </p>
 *
 * @author slnt23
 * @since 2026-04-24 17:13:37
 */
public interface FeatureService extends IService<FeatureDO> {

    List<FeatureVO> listByOrder();
    ResultPage<FeatureVO> page(long pageNum, long pageSize);
    FeatureVO getById(Long id);
    Integer create(FeatureDTO dto);
    Boolean update(FeatureDTO vo);
    Boolean deleteById(Long id);
}