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

import com.relax.owl.admin.convert.MenuItemConvert;
import com.relax.owl.admin.domain.dto.MenuItemDTO;
import com.relax.owl.admin.domain.entity.MenuItemDO;
import com.relax.owl.admin.domain.vo.MenuItemVO;
import com.relax.owl.admin.mapper.MenuItemMapper;
import com.relax.owl.admin.service.MenuItemService;
import com.relax.owl.common.exception.BizException;
import com.relax.owl.common.result.ResultPage;
import com.relax.owl.common.result.ResultStatus;
import com.relax.owl.infra.minio.constant.MinioConstant;
import com.relax.owl.infra.minio.service.FileStorageService;
import com.relax.owl.log.annotation.OperationLog;
import com.relax.owl.log.constant.LogType;

/**
 * 菜单项业务实现。
 *
 * <p>配图放 {@link MinioConstant#BUCKET_IMAGES}；数据库只存裸对象 key，出参统一预签名。</p>
 *
 * @author slnt23
 * @since 2026/10/4
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MenuItemServiceImpl extends ServiceImpl<MenuItemMapper, MenuItemDO> implements MenuItemService {

    /** 允许的配图类型 */
    private static final Set<String> ALLOWED_IMAGE_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");
    /** 配图大小上限 5MB */
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024;
    /** 状态：启用 */
    private static final Integer STATUS_ENABLED = 1;
    /** 状态：禁用 */
    private static final Integer STATUS_DISABLED = 0;
    /** 默认卡片尺寸 */
    private static final String DEFAULT_CARD_SIZE = "normal";

    private final MenuItemMapper menuItemMapper;
    private final MenuItemConvert menuItemConvert;
    private final FileStorageService fileStorageService;

    @Override
    public List<MenuItemVO> listEnabled() {
        List<MenuItemDO> list = menuItemMapper.selectEnabled();
        list.forEach(this::fillPresignedUrl);
        return menuItemConvert.DOConvertVO(list);
    }

    @Override
    public ResultPage<MenuItemVO> page(long pageNum, long pageSize) {
        if (pageNum <= 0) {
            pageNum = 1;
        }
        if (pageSize <= 0) {
            pageSize = 10;
        }
        if (pageSize > 100) {
            pageSize = 100;
        }

        Page<MenuItemDO> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<MenuItemDO> wrapper = Wrappers.lambdaQuery();
        wrapper.orderByAsc(MenuItemDO::getSortOrder).orderByAsc(MenuItemDO::getId);

        IPage<MenuItemDO> result = menuItemMapper.selectPage(page, wrapper);
        List<MenuItemDO> records = result.getRecords();
        records.forEach(this::fillPresignedUrl);
        List<MenuItemVO> voList = menuItemConvert.DOConvertVO(records);

        ResultPage<MenuItemVO> pageResult = new ResultPage<>();
        pageResult.setCurrentPage(result.getCurrent());
        pageResult.setPageSize(result.getSize());
        pageResult.setTotal(result.getTotal());
        pageResult.setTotalPage(result.getPages());
        pageResult.setRecords(voList);
        return pageResult;
    }

    @Override
    public MenuItemVO getById(Long id) {
        MenuItemDO menuItemDO = menuItemMapper.selectById(id);
        if (menuItemDO == null) {
            return null;
        }
        fillPresignedUrl(menuItemDO);
        return menuItemConvert.DOConvertVO(menuItemDO);
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "新增菜单项", persist = true)
    public int create(MenuItemDTO dto) {
        validateImage(dto.getImage());

        MenuItemDO menuItemDO = menuItemConvert.DTOConvertDO(dto);
        menuItemDO.setImageUrl(fileStorageService.upload(dto.getImage(), MinioConstant.BUCKET_IMAGES));
        menuItemDO.setCardSize(StringUtils.hasText(dto.getCardSize()) ? dto.getCardSize() : DEFAULT_CARD_SIZE);
        menuItemDO.setSortOrder(dto.getSortOrder() == null ? 0 : dto.getSortOrder());
        menuItemDO.setStatus(dto.getStatus() == null ? STATUS_ENABLED : dto.getStatus());

        return menuItemMapper.insert(menuItemDO);
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "修改菜单项", persist = true)
    public Boolean update(MenuItemDTO dto) {
        MenuItemDO existing = menuItemMapper.selectById(dto.getId());
        if (existing == null) {
            throw new BizException(ResultStatus.DATA_NOT_EXIST);
        }

        MenuItemDO menuItemDO = menuItemConvert.DTOConvertDO(dto);
        menuItemDO.setId(dto.getId());
        // 先继承原对象 key，只有确实传了新文件才覆盖
        menuItemDO.setImageUrl(existing.getImageUrl());

        String replacedImageKey = null;
        if (isPresent(dto.getImage())) {
            validateImage(dto.getImage());
            menuItemDO.setImageUrl(fileStorageService.upload(dto.getImage(), MinioConstant.BUCKET_IMAGES));
            replacedImageKey = existing.getImageUrl();
        }

        // 此处不校验受影响行数：MySQL 在字段值未发生实际变化时返回 0，
        // 而"没改动就保存"属于合法的无操作，不应被判为失败。
        menuItemMapper.updateById(menuItemDO);

        // 数据库更新成功后再清理被替换掉的旧文件，避免更新失败导致文件已丢
        deleteObjectQuietly(replacedImageKey);
        return true;
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "删除菜单项", persist = true)
    public Boolean deleteById(Long id) {
        MenuItemDO existing = menuItemMapper.selectById(id);
        if (existing == null) {
            return false;
        }

        int result = menuItemMapper.deleteById(id);
        if (result != 1) {
            return false;
        }

        // 先删记录再删文件；文件删除失败只记日志，不回滚已完成的删除
        deleteObjectQuietly(existing.getImageUrl());
        return true;
    }

    @Override
    @OperationLog(type = LogType.ADMIN, module = "首页配置", action = "启停菜单项", persist = true)
    public Boolean updateStatus(Long id, Integer status) {
        MenuItemDO existing = menuItemMapper.selectById(id);
        if (existing == null) {
            return false;
        }

        Integer target = STATUS_ENABLED.equals(status) ? STATUS_ENABLED : STATUS_DISABLED;
        if (target.equals(existing.getStatus())) {
            return true;
        }

        LambdaUpdateWrapper<MenuItemDO> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(MenuItemDO::getId, id)
                .set(MenuItemDO::getStatus, target);

        return menuItemMapper.update(null, wrapper) > 0;
    }

    /**
     * 把 DO 中的裸对象 key 替换为预签名 URL。
     *
     * <p>统一使用 {@link MinioConstant#EXPIRY_MAX_TIME}（7 天）：菜单面板每次打开都会重新拉取，
     * 长有效期可避免页面长时间停留后图片请求 403。</p>
     */
    private void fillPresignedUrl(MenuItemDO menuItemDO) {
        if (menuItemDO == null || !StringUtils.hasText(menuItemDO.getImageUrl())) {
            return;
        }
        menuItemDO.setImageUrl(fileStorageService.getUrl(
                MinioConstant.BUCKET_IMAGES, menuItemDO.getImageUrl(), MinioConstant.EXPIRY_MAX_TIME));
    }

    /**
     * 删除对象存储中的文件，失败只记录日志，不影响主流程。
     */
    private void deleteObjectQuietly(String objectName) {
        if (!StringUtils.hasText(objectName)) {
            return;
        }
        try {
            fileStorageService.delete(MinioConstant.BUCKET_IMAGES, objectName);
        } catch (Exception e) {
            log.warn("清理菜单配图对象失败，object={}", objectName, e);
        }
    }

    /** 文件是否真实携带内容 */
    private boolean isPresent(MultipartFile file) {
        return file != null && !file.isEmpty();
    }

    /**
     * 校验配图文件：非空、类型、大小。
     */
    private void validateImage(MultipartFile file) {
        if (!isPresent(file)) {
            throw new BizException(ResultStatus.FILE_TYPE_ERROR);
        }
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new BizException(ResultStatus.FILE_SIZE_EXCEEDED);
        }
        if (!ALLOWED_IMAGE_TYPES.contains(file.getContentType())) {
            throw new BizException(ResultStatus.FILE_TYPE_ERROR);
        }
    }
}
