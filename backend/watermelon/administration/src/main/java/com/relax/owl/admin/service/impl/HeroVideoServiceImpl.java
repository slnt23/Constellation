package com.relax.owl.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

import com.relax.owl.admin.convert.HeroVideoConvert;
import com.relax.owl.admin.domain.dto.HeroVideoDTO;
import com.relax.owl.admin.domain.entity.HeroVideoDO;
import com.relax.owl.admin.domain.vo.HeroVideoVO;
import com.relax.owl.admin.mapper.HeroVideoMapper;
import com.relax.owl.admin.service.HeroVideoService;
import com.relax.owl.common.exception.BizException;
import com.relax.owl.common.result.ResultPage;
import com.relax.owl.common.result.ResultStatus;
import com.relax.owl.infra.minio.constant.MinioConstant;
import com.relax.owl.infra.minio.service.FileStorageService;
import com.relax.owl.log.annotation.OperationLog;
import com.relax.owl.log.constant.LogType;

/**
 * Hero 视频业务实现。
 *
 * <p>对象存储的分工：视频放 {@link MinioConstant#BUCKET_VIDEOS}，封面图放
 * {@link MinioConstant#BUCKET_IMAGES}；数据库只存裸对象 key，出参统一预签名。</p>
 *
 * @author slnt23
 * @since 2026/10/2
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HeroVideoServiceImpl extends ServiceImpl<HeroVideoMapper, HeroVideoDO> implements HeroVideoService {

    /** 允许的视频类型 */
    private static final Set<String> ALLOWED_VIDEO_TYPES =
            Set.of("video/mp4", "video/webm", "video/quicktime");
    /** 允许的封面图类型 */
    private static final Set<String> ALLOWED_IMAGE_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");
    /** 视频大小上限 50MB */
    private static final long MAX_VIDEO_SIZE = 50L * 1024 * 1024;
    /** 封面图大小上限 5MB */
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;
    /** 状态：启用 */
    private static final Integer STATUS_ENABLED = 1;
    /** 状态：禁用 */
    private static final Integer STATUS_DISABLED = 0;

    private final HeroVideoMapper heroVideoMapper;
    private final HeroVideoConvert heroVideoConvert;
    private final FileStorageService fileStorageService;

    @Override
    public HeroVideoVO getActive() {
        HeroVideoDO heroVideoDO = heroVideoMapper.selectActive();
        if (heroVideoDO == null) {
            return null;
        }
        fillPresignedUrls(heroVideoDO);
        return heroVideoConvert.DOConvertVO(heroVideoDO);
    }

    @Override
    public ResultPage<HeroVideoVO> page(long pageNum, long pageSize) {
        if (pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize <= 0) {
            pageSize = 10;
        }
        if (pageSize > 100) {
            pageSize = 100;
        }

        Page<HeroVideoDO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<HeroVideoDO> wrapper = Wrappers.lambdaQuery();
        wrapper.orderByAsc(HeroVideoDO::getSortOrder).orderByAsc(HeroVideoDO::getId);

        IPage<HeroVideoDO> result = heroVideoMapper.selectPage(page, wrapper);
        List<HeroVideoDO> records = result.getRecords();
        records.forEach(this::fillPresignedUrls);
        List<HeroVideoVO> voList = heroVideoConvert.DOConvertVO(records);

        ResultPage<HeroVideoVO> pageResult = new ResultPage<>();
        pageResult.setCurrentPage(result.getCurrent());
        pageResult.setPageSize(result.getSize());
        pageResult.setTotal(result.getTotal());
        pageResult.setTotalPage(result.getPages());
        pageResult.setRecords(voList);
        return pageResult;
    }

    @Override
    public HeroVideoVO getById(Long id) {
        HeroVideoDO heroVideoDO = heroVideoMapper.selectById(id);
        if (heroVideoDO == null) {
            return null;
        }
        fillPresignedUrls(heroVideoDO);
        return heroVideoConvert.DOConvertVO(heroVideoDO);
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "新增Hero视频", persist = true)
    public int create(HeroVideoDTO dto) {
        validateVideo(dto.getVideo());
        validatePoster(dto.getPoster());

        HeroVideoDO heroVideoDO = heroVideoConvert.DTOConvertDO(dto);
        heroVideoDO.setVideoUrl(fileStorageService.upload(dto.getVideo(), MinioConstant.BUCKET_VIDEOS));
        if (isPresent(dto.getPoster())) {
            heroVideoDO.setPosterUrl(fileStorageService.upload(dto.getPoster(), MinioConstant.BUCKET_IMAGES));
        }
        heroVideoDO.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        heroVideoDO.setStatus(dto.getStatus() == null ? STATUS_ENABLED : dto.getStatus());

        return heroVideoMapper.insert(heroVideoDO);
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "修改Hero视频", persist = true)
    public Boolean update(HeroVideoDTO dto) {
        HeroVideoDO existing = heroVideoMapper.selectById(dto.getId());
        if (existing == null) {
            throw new BizException(ResultStatus.DATA_NOT_EXIST);
        }

        HeroVideoDO heroVideoDO = heroVideoConvert.DTOConvertDO(dto);
        heroVideoDO.setId(dto.getId());
        // 先继承原对象 key，只有确实传了新文件才覆盖
        heroVideoDO.setVideoUrl(existing.getVideoUrl());
        heroVideoDO.setPosterUrl(existing.getPosterUrl());

        String replacedVideoKey = null;
        String replacedPosterKey = null;

        if (isPresent(dto.getVideo())) {
            validateVideo(dto.getVideo());
            heroVideoDO.setVideoUrl(fileStorageService.upload(dto.getVideo(), MinioConstant.BUCKET_VIDEOS));
            replacedVideoKey = existing.getVideoUrl();
        }
        if (isPresent(dto.getPoster())) {
            validatePoster(dto.getPoster());
            heroVideoDO.setPosterUrl(fileStorageService.upload(dto.getPoster(), MinioConstant.BUCKET_IMAGES));
            replacedPosterKey = existing.getPosterUrl();
        }

        // 此处不校验受影响行数：MySQL 在字段值未发生实际变化时返回 0，
        // 而"没改动就保存"属于合法的无操作，不应被判为失败。
        heroVideoMapper.updateById(heroVideoDO);

        // 数据库更新成功后再清理被替换掉的旧文件，避免更新失败导致文件已丢
        deleteObjectQuietly(MinioConstant.BUCKET_VIDEOS, replacedVideoKey);
        deleteObjectQuietly(MinioConstant.BUCKET_IMAGES, replacedPosterKey);
        return true;
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "删除Hero视频", persist = true)
    public Boolean deleteById(Long id) {
        HeroVideoDO existing = heroVideoMapper.selectById(id);
        if (existing == null) {
            return false;
        }

        int result = heroVideoMapper.deleteById(id);
        if (result != 1) {
            return false;
        }

        // 先删记录再删文件；文件删除失败只记日志，不回滚已完成的删除
        deleteObjectQuietly(MinioConstant.BUCKET_VIDEOS, existing.getVideoUrl());
        deleteObjectQuietly(MinioConstant.BUCKET_IMAGES, existing.getPosterUrl());
        return true;
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "启停Hero视频", persist = true)
    public Boolean updateStatus(Long id, Integer status) {
        HeroVideoDO existing = heroVideoMapper.selectById(id);
        if (existing == null) {
            return false;
        }

        Integer target = STATUS_ENABLED.equals(status) ? STATUS_ENABLED : STATUS_DISABLED;
        if (target.equals(existing.getStatus())) {
            return true;
        }

        LambdaUpdateWrapper<HeroVideoDO> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(HeroVideoDO::getId, id)
                .set(HeroVideoDO::getStatus, target);

        return heroVideoMapper.update(null, wrapper) > 0;
    }

    /**
     * 把 DO 中的裸对象 key 替换为预签名 URL。
     *
     * <p>统一使用 {@link MinioConstant#EXPIRY_MAX_TIME}（7 天）：hero 是公开内容，
     * 长有效期没有额外风险，同时避免页面长时间停留后视频请求 403。</p>
     */
    private void fillPresignedUrls(HeroVideoDO heroVideoDO) {
        if (heroVideoDO == null) {
            return;
        }
        if (StringUtils.hasText(heroVideoDO.getVideoUrl())) {
            heroVideoDO.setVideoUrl(fileStorageService.getUrl(
                    MinioConstant.BUCKET_VIDEOS, heroVideoDO.getVideoUrl(), MinioConstant.EXPIRY_MAX_TIME));
        }
        if (StringUtils.hasText(heroVideoDO.getPosterUrl())) {
            heroVideoDO.setPosterUrl(fileStorageService.getUrl(
                    MinioConstant.BUCKET_IMAGES, heroVideoDO.getPosterUrl(), MinioConstant.EXPIRY_MAX_TIME));
        }
    }

    /**
     * 删除对象存储中的文件，失败只记录日志，不影响主流程。
     */
    private void deleteObjectQuietly(String bucketName, String objectName) {
        if (!StringUtils.hasText(objectName)) {
            return;
        }
        try {
            fileStorageService.delete(bucketName, objectName);
        } catch (Exception e) {
            log.warn("清理 Hero 视频对象失败，bucket={}, object={}", bucketName, objectName, e);
        }
    }

    /** 文件是否真实携带内容 */
    private boolean isPresent(MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    /**
     * 校验视频文件：非空、类型、大小。
     */
    private void validateVideo(MultipartFile file) {
        if (!isPresent(file)) {
            throw new BizException(ResultStatus.VIDEO_TYPE_ERROR);
        }
        if (file.getSize() > MAX_VIDEO_SIZE) {
            throw new BizException(ResultStatus.VIDEO_SIZE_EXCEEDED);
        }
        if (!ALLOWED_VIDEO_TYPES.contains(file.getContentType())) {
            throw new BizException(ResultStatus.VIDEO_TYPE_ERROR);
        }
    }

    /**
     * 校验封面图文件：类型、大小，允许不传。
     */
    private void validatePoster(MultipartFile file) {
        if (!isPresent(file)) {
            return;
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new BizException(ResultStatus.FILE_SIZE_EXCEEDED);
        }
        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new BizException(ResultStatus.FILE_TYPE_ERROR);
        }
    }
}
