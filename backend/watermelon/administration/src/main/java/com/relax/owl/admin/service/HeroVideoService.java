package com.relax.owl.admin.service;

import com.baomidou.mybatisplus.spring.service.IService;
import com.relax.owl.admin.domain.dto.HeroVideoDTO;
import com.relax.owl.admin.domain.entity.HeroVideoDO;
import com.relax.owl.admin.domain.vo.HeroVideoVO;
import com.relax.owl.common.result.ResultPage;

/**
 * Hero 视频业务接口。
 *
 * @author slnt23
 * @since 2026/10/2
 */
public interface HeroVideoService extends IService<HeroVideoDO> {

    /**
     * 查询当前生效的 Hero 视频：启用中且排序最靠前的一条。
     *
     * @return 生效视频，没有启用记录时返回 null
     */
    HeroVideoVO getActive();

    /**
     * 分页查询全部 Hero 视频，按 sort_order 升序。
     */
    ResultPage<HeroVideoVO> page(long pageNum, long pageSize);

    /**
     * 查询单条详情，URL 已预签名。
     */
    HeroVideoVO getById(Long id);

    /**
     * 新增 Hero 视频。
     *
     * @return 受影响行数，1 表示新增成功
     */
    int create(HeroVideoDTO dto);

    /**
     * 更新 Hero 视频；未重新上传视频时保留原视频。
     *
     * @return 是否更新成功
     */
    Boolean update(HeroVideoDTO dto);

    /**
     * 删除 Hero 视频，同时清理对象存储中的视频与封面文件。
     *
     * @return 是否删除成功
     */
    Boolean deleteById(Long id);

    /**
     * 启用/禁用 Hero 视频。
     *
     * @param status 1=启用，0=禁用
     * @return 是否操作成功
     */
    Boolean updateStatus(Long id, Integer status);
}
