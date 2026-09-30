package com.relax.owl.sugarcane.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import com.relax.owl.log.annotation.OperationLog;
import com.relax.owl.sugarcane.constant.CacheConstant;
import com.relax.owl.sugarcane.domain.dto.ItemIntroDTO;
import com.relax.owl.sugarcane.domain.vo.PriceItemVO;
import com.relax.owl.sugarcane.mapper.ItemMapper;
import com.relax.owl.sugarcane.service.ItemService;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import com.relax.owl.sugarcane.domain.entity.ItemDO;

/**
 * <p>
 * 被定价物品表 服务实现类
 * </p>
 *
 * @author slnt23
 * @since 2026-04-12 20:43:32
 */
@Service
@RequiredArgsConstructor
public class ItemServiceImpl extends ServiceImpl<ItemMapper, ItemDO> implements ItemService {

    final ItemMapper itemMapper;

    @Override
    @OperationLog(module = "sugarcane", action = "模糊分页搜索物品Item")
    @Cacheable(value = CacheConstant.ITEM_PAGE,
            key = "'page:' + #itemIntroDTO.pageNum + ':' + #itemIntroDTO.pageSize + ':' + #itemIntroDTO.itemName",
            sync = true)
    public IPage<PriceItemVO> getItemIntroList(ItemIntroDTO itemIntroDTO) {
        Page<PriceItemVO> pageItems = new Page<>(itemIntroDTO.getPageNum(), itemIntroDTO.getPageSize());
        IPage<PriceItemVO> result = itemMapper.selectPageItems(pageItems, itemIntroDTO.getItemName());

        if (result.getRecords() == null || result.getRecords().isEmpty()) {
            return null;
        }
        return result;
    }
}
