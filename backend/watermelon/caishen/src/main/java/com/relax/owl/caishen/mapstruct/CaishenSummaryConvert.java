package com.relax.owl.caishen.mapstruct;

import org.mapstruct.Mapper;
import com.relax.owl.caishen.domain.entity.CaishenSummaryDO;
import com.relax.owl.caishen.domain.vo.SummaryVO;

import java.util.List;

/**
 * 总结记录与 VO 转换。
 *
 * @author slnt23
 * @since 2026/8/23
 */
@Mapper(componentModel = "spring")
public interface CaishenSummaryConvert {

    SummaryVO toVO(CaishenSummaryDO summary);

    List<SummaryVO> toVOList(List<CaishenSummaryDO> summaries);
}
