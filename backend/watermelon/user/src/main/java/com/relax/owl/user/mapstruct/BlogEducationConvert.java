package com.relax.owl.user.mapstruct;

import org.mapstruct.Mapper;
import com.relax.owl.user.domain.entity.BlogEducationDO;
import com.relax.owl.user.domain.vo.BlogEducationVO;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BlogEducationConvert {

    BlogEducationVO toVO(BlogEducationDO education);

    List<BlogEducationVO> toVOList(List<BlogEducationDO> educations);
}