package com.relax.owl.user.service;

import com.relax.owl.user.domain.dto.BlogSettingsDTO;
import com.relax.owl.user.domain.vo.BlogSettingsVO;

public interface BlogSettingsService {

    BlogSettingsVO get(Long userId);

    Boolean update(BlogSettingsDTO dto, Long userId);
}