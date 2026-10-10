-- ======================================================
-- OWL 数据库：admin 模块 canonical DDL
-- 模块：admin
-- MySQL 版本：8.4
-- 说明：首页展示配置由 admin 模块维护。
-- ======================================================

-- ------------------------------------------------------
-- 1. 首页焦点展示项目表
-- ------------------------------------------------------
CREATE TABLE admin_spotlight
(
    id          BIGINT UNSIGNED AUTO_INCREMENT COMMENT '主键ID',
    eyebrow     VARCHAR(100) NOT NULL COMMENT '眉题/前置标题',
    title       VARCHAR(200) NOT NULL COMMENT '主标题',
    description TEXT COMMENT '详细描述',
    image_url   VARCHAR(500) NOT NULL COMMENT '配图URL',
    sort_order  INT          NOT NULL DEFAULT 0 COMMENT '排序序号，数值越小越靠前',
    link        VARCHAR(500) COMMENT '点击跳转链接',
    target      VARCHAR(20)  NOT NULL DEFAULT '_self' COMMENT '链接打开方式',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (id),
    KEY idx_admin_spotlight_sort_order (sort_order)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = '首页焦点展示项目表';

-- ------------------------------------------------------
-- 2. 产品特性展示表
-- ------------------------------------------------------
CREATE TABLE admin_feature
(
    id          BIGINT UNSIGNED AUTO_INCREMENT COMMENT '主键ID',
    icon        VARCHAR(500) NOT NULL COMMENT '图标标识',
    title       VARCHAR(200) NOT NULL COMMENT '特性标题',
    description TEXT COMMENT '特性详细说明',
    sort_order  INT          NOT NULL DEFAULT 0 COMMENT '排序序号，数值越小越靠前',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = '产品特性展示表';

-- ------------------------------------------------------
-- 3. 首页 Hero 视频表
-- ------------------------------------------------------
CREATE TABLE admin_hero_video
(
    id          BIGINT UNSIGNED AUTO_INCREMENT COMMENT '主键ID',
    title       VARCHAR(200) NOT NULL COMMENT '视频标题/标识',
    video_url   VARCHAR(500) NOT NULL COMMENT '视频对象存储路径',
    poster_url  VARCHAR(500) COMMENT '封面图对象存储路径',
    sort_order  INT          NOT NULL DEFAULT 0 COMMENT '排序序号，数值越小越靠前',
    status      TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
    remark      VARCHAR(500) COMMENT '备注',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (id),
    KEY idx_admin_hero_video_sort_order (sort_order)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = '首页 Hero 视频表';

-- ------------------------------------------------------
-- 4. 前台菜单项表
-- ------------------------------------------------------
CREATE TABLE admin_menu_item
(
    id          BIGINT UNSIGNED AUTO_INCREMENT COMMENT '主键ID',
    title       VARCHAR(100) NOT NULL COMMENT '菜单标题',
    subtitle    VARCHAR(200) COMMENT '菜单副标题',
    path        VARCHAR(200) NOT NULL COMMENT '跳转的前端路由',
    image_url   VARCHAR(500) NOT NULL COMMENT '菜单配图对象存储路径',
    card_size   VARCHAR(20)  NOT NULL DEFAULT 'normal' COMMENT '卡片尺寸：large/normal/small',
    sort_order  INT          NOT NULL DEFAULT 0 COMMENT '排序序号，数值越小越靠前',
    status      TINYINT(1)   NOT NULL DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
    remark      VARCHAR(500) COMMENT '备注',
    create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',

    PRIMARY KEY (id),
    KEY idx_admin_menu_item_sort_order (sort_order)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci
  COMMENT = '前台菜单项表';
