package com.relax.owl.caishen.mapstruct;

import org.mapstruct.Mapper;
import com.relax.owl.caishen.domain.entity.CaishenFundDO;
import com.relax.owl.caishen.domain.entity.CaishenFundNavDO;
import com.relax.owl.caishen.domain.vo.FundNavVO;
import com.relax.owl.caishen.domain.vo.FundVO;

import java.util.List;

/**
 * 基金档案 / 净值 与 VO 转换。
 *
 * @author slnt23
 * @since 2026/8/23
 */
@Mapper(componentModel = "spring")
public interface CaishenFundConvert {

    FundVO toVO(CaishenFundDO fund);

    List<FundVO> toVOList(List<CaishenFundDO> funds);

    FundNavVO toNavVO(CaishenFundNavDO nav);

    List<FundNavVO> toNavVOList(List<CaishenFundNavDO> navs);
}
