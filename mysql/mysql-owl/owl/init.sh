#!/bin/bash
# ==============================================================
# OWL 建表统一入口(由 mysql 镜像在首次初始化时自动执行)
# --------------------------------------------------------------
# 机制说明:
#   mysql:8.4 官方镜像只在「数据目录为空」的首次启动时执行
#   /docker-entrypoint-initdb.d/ 顶层 *.sh / *.sql(按字母序,
#   不递归子目录,每个 .sql 独立会话执行)。
#   因此:顶层 init.sql 只负责建库;本脚本负责按依赖顺序把
#   子目录中的模块脚本逐个执行(全部落在 OWL 库)。
#   之后 init.sql 仍会被 entrypoint 单独跑一次,其内容为
#   CREATE DATABASE IF NOT EXISTS + USE,幂等,无副作用。
# ==============================================================
set -e

mysql=( mysql --protocol=socket -uroot -hlocalhost --socket=/var/run/mysqld/mysqld.sock -p"${MYSQL_ROOT_PASSWORD}" )

echo "[OWL-init] create database OWL"
"${mysql[@]}" < /docker-entrypoint-initdb.d/init.sql

# 模块脚本执行顺序(含依赖关系):
#   各模块间无交叉外键;user/ 内部有依赖:
#   user_db(user_account/user_role) 必须先于
#   user_blog / user_gallery(内联外键引用),user_init_data(纯数据)最后。
#   新增模块脚本请按依赖顺序加入此列表。
files=(
    admin/front_db.sql
    caishen/caishen_db.sql
    crow/crow_db.sql
    log/log_db.sql
    sugarcane/sugarcane_db.sql
    user/user_db.sql
    user/user_blog.sql
    user/user_gallery.sql
    user/user_init_data.sql
)

for rel in "${files[@]}"; do
    f="/docker-entrypoint-initdb.d/${rel}"
    if [ ! -f "$f" ]; then
        echo "[OWL-init] WARN: missing ${rel}, skip" >&2
        continue
    fi
    echo "[OWL-init] applying ${rel}"
    "${mysql[@]}" --database=OWL < "$f"
done

echo "[OWL-init] done"
