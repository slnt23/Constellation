-- ============================================
-- Blog Module Data - MySQL Insert Statements
-- Generated from frontend mock data
-- Adapted to match user_blog.sql schema
-- Date: 2026-09-02
-- ============================================

-- ============================================
-- 1. Blog Posts Data
-- ============================================

-- Post 1
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '更适合北大宝宝体质的 xv6 OS Lab 踩坑记 - Part8',
    '北京大学 2025 年秋季学期操作系统/OS Lab Part 8',
    '# xv6 OS Lab Part 8\n\n这里是文章正文内容（Markdown 格式）...\n\n## 踩坑记录\n\n具体的踩坑内容和解决方案...',
    NULL,
    '["操作系统", "xv6", "pku"]',
    1,
    8,
    '2026-01-12 07:00:01',
    '2026-01-12 07:00:01',
    0
);

-- Post 2
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '更适合北大宝宝体质的 xv6 OS Lab 踩坑记 - Part6',
    '北京大学 2025 年秋季学期操作系统/OS Lab Part 6',
    '# xv6 OS Lab Part 6\n\n这里是文章正文内容（Markdown 格式）...\n\n## 踩坑记录\n\n具体的踩坑内容和解决方案...',
    NULL,
    '["操作系统", "xv6", "pku"]',
    1,
    6,
    '2026-01-12 07:00:00',
    '2026-01-12 07:00:00',
    0
);

-- Post 3
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '如何降级 iOS / iPadOS App',
    '唉，商业化，原本好好的 App 就这么被塞满了广告',
    '# 如何降级 iOS / iPadOS App\n\n这里是文章正文内容（Markdown 格式）...\n\n## 降级步骤\n\n具体的降级步骤和注意事项...',
    NULL,
    '["ics", "pku"]',
    1,
    3,
    '2025-11-29 00:00:00',
    '2025-11-29 00:00:00',
    0
);

-- Post 4
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '从零开始配置 Windows',
    '环境配置什么的真是烦死辣！',
    '# 从零开始配置 Windows\n\n这里是文章正文内容（Markdown 格式）...\n\n## 环境配置\n\n具体的环境配置步骤...',
    NULL,
    '["windows", "shell", "wsl", "initialize"]',
    1,
    4,
    '2025-11-26 00:00:00',
    '2025-11-26 00:00:00',
    0
);

-- Post 5
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    'PKU Art - 简洁优雅的教学网美化方案',
    'PKU Art 是一个美化北京大学教学网的浏览器扩展与用户样式表，提供优雅、现代化的视觉体验。',
    '# PKU Art\n\n这里是文章正文内容（Markdown 格式）...\n\n## 安装与使用\n\n具体的安装和使用说明...',
    NULL,
    '["pku", "css", "javascript"]',
    1,
    5,
    '2025-11-24 00:00:00',
    '2025-11-24 00:00:00',
    0
);

-- Post 6
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '更适合北大宝宝体质的 xv6 OS Lab 踩坑记 - Part5',
    '北京大学 2025 年秋季学期操作系统/OS Lab Part 5',
    '# xv6 OS Lab Part 5\n\n这里是文章正文内容（Markdown 格式）...\n\n## 踩坑记录\n\n具体的踩坑内容和解决方案...',
    NULL,
    '["操作系统", "xv6", "pku"]',
    1,
    2,
    '2025-11-23 00:00:00',
    '2025-11-23 00:00:00',
    0
);

-- Post 7
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    '从零开始配置 Mac',
    '环境配置什么的真是烦死辣！',
    '# 从零开始配置 Mac\n\n这里是文章正文内容（Markdown 格式）...\n\n## 环境配置\n\n具体的环境配置步骤...',
    NULL,
    '["mac", "initialize"]',
    1,
    1,
    '2025-11-12 00:00:00',
    '2025-11-12 00:00:00',
    0
);

-- Post 8
INSERT INTO blog_post (user_id, title, excerpt, content, cover_url, tags, status, sort_order, create_time, update_time, deleted)
VALUES (
    1,
    'PKU VPN 3 - 用校内服务器实现 PKU 内网和 Clash/Surge 兼容使用',
    '我真没想到这玩意还会出第三篇',
    '# PKU VPN 3\n\n这里是文章正文内容（Markdown 格式）...\n\n## 配置步骤\n\n具体的配置步骤和注意事项...',
    NULL,
    '["clash", "surge", "pku", "vpn"]',
    1,
    0,
    '2025-11-11 00:00:00',
    '2025-11-11 00:00:00',
    0
);

-- ============================================
-- 2. Blog Settings Data
-- ============================================

INSERT INTO blog_settings (user_id, tag_line, bio, location, github_url, codetime_url, poem, update_time)
VALUES (
    1,
    'Developer / Designer / <del>Medical student</del>',
    '["你好，我叫 Arthals，是一个兴趣使然、热爱编程的医学生。","目前就读于北京大学医学部，同时修读计算机科学技术双学位。一边被 <del>病理病生药理</del> 内外妇儿折磨，一边在 <del>ICS 的 Lab 作业</del> PyTorch 中 debug 到头秃。","我即将在北京大学先进制造与机器人学院攻读博士学位。","我的兴趣主要在 Large Language Model / Embodied AI 方向。","我喜欢 Minecraft。"]',
    'China / Beijing',
    'https://github.com',
    'https://shields.jannchie.com/endpoint?style=flat&color=222&url=https%3A%2F%2Fapi.codetime.dev%2Fv3%2Fusers%2Fshield%3Fuid%3D20455',
    '春潮带雨晚来急，野渡无人舟自横。',
    NOW()
);

-- ============================================
-- 3. Education Data
-- ============================================

INSERT INTO blog_education (user_id, school, degree, period, sort_order, create_time)
VALUES
    (1, '北京大学', '预防医学 & 计算机科学技术双学位', 'August 2021 - Present', 1, NOW()),
    (1, '中国人民大学附属中学', '早培班 & 人工智能实验班', 'August 2014 - July 2021', 2, NOW());

-- ============================================
-- 4. Skills Data
-- ============================================

-- Skill Category: Web
INSERT INTO blog_skill_category (user_id, category, sort_order, create_time) VALUES (1, 'Web', 1, NOW());
SET @web_category_id = LAST_INSERT_ID();

INSERT INTO blog_skill_item (category_id, item_name, sort_order, create_time) VALUES
    (@web_category_id, 'Vue.js', 1, NOW()),
    (@web_category_id, 'Nuxt.js', 2, NOW()),
    (@web_category_id, 'Node.js', 3, NOW()),
    (@web_category_id, 'React.js', 4, NOW()),
    (@web_category_id, 'TypeScript', 5, NOW()),
    (@web_category_id, 'JavaScript', 6, NOW()),
    (@web_category_id, 'CSS', 7, NOW()),
    (@web_category_id, 'HTML', 8, NOW());

-- Skill Category: Programming
INSERT INTO blog_skill_category (user_id, category, sort_order, create_time) VALUES (1, 'Programming', 2, NOW());
SET @prog_category_id = LAST_INSERT_ID();

INSERT INTO blog_skill_item (category_id, item_name, sort_order, create_time) VALUES
    (@prog_category_id, 'Python', 1, NOW()),
    (@prog_category_id, 'PyTorch', 2, NOW()),
    (@prog_category_id, 'C', 3, NOW()),
    (@prog_category_id, 'C++', 4, NOW()),
    (@prog_category_id, 'C#', 5, NOW()),
    (@prog_category_id, 'R', 6, NOW()),
    (@prog_category_id, 'MySQL', 7, NOW()),
    (@prog_category_id, 'PostgreSQL', 8, NOW());

-- Skill Category: Tools
INSERT INTO blog_skill_category (user_id, category, sort_order, create_time) VALUES (1, 'Tools', 3, NOW());
SET @tools_category_id = LAST_INSERT_ID();

INSERT INTO blog_skill_item (category_id, item_name, sort_order, create_time) VALUES
    (@tools_category_id, 'VSCode', 1, NOW()),
    (@tools_category_id, 'Vim', 2, NOW()),
    (@tools_category_id, 'Git', 3, NOW()),
    (@tools_category_id, 'Linux', 4, NOW()),
    (@tools_category_id, 'Docker', 5, NOW()),
    (@tools_category_id, 'Nginx', 6, NOW());

-- Skill Category: Design
INSERT INTO blog_skill_category (user_id, category, sort_order, create_time) VALUES (1, 'Design', 4, NOW());
SET @design_category_id = LAST_INSERT_ID();

INSERT INTO blog_skill_item (category_id, item_name, sort_order, create_time) VALUES
    (@design_category_id, 'Figma', 1, NOW()),
    (@design_category_id, 'Photoshop', 2, NOW()),
    (@design_category_id, 'Illustrator', 3, NOW());

-- Skill Category: Other
INSERT INTO blog_skill_category (user_id, category, sort_order, create_time) VALUES (1, 'Other', 5, NOW());
SET @other_category_id = LAST_INSERT_ID();

INSERT INTO blog_skill_item (category_id, item_name, sort_order, create_time) VALUES
    (@other_category_id, 'Markdown', 1, NOW()),
    (@other_category_id, 'LaTeX', 2, NOW());

-- ============================================
-- End of Insert Statements
-- ============================================