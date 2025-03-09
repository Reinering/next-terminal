#! /bin/bash


# SQLite数据库文件路径
DB_PATH="/usr/local/next-terminal/data/sqlite/next-terminal.db"

# 检查数据库文件是否存在
if [ ! -f "$DB_PATH" ]; then
    echo "错误：数据库文件 $DB_PATH 不存在"
    exit 1
fi


# 定义要执行的SQL更新语句
SQL1="
CREATE TABLE IF NOT EXISTS "user_precmds" (
  "id" text NOT NULL,
  "\`group\`" text NOT NULL,
  "label" text NOT NULL,
  "text" text,
  "created" datetime NOT NULL
);
"

SQL2=""

SQLS=(SQL1)

# 执行更新操作的函数
execute_sql() {
    local sql="$1"
    echo "执行SQL: $sql"
    sqlite3 "$DB_PATH" "$sql"

    # 检查执行结果
    if [ $? -eq 0 ]; then
        echo "执行成功"
    else
        echo "执行失败"
        exit 1
    fi
}

# 主函数
main() {
    echo "开始更新数据库: $DB_PATH"
    echo "------------------------"

    for i in ${SQLS[@]}; do
        varname=$i
        declare -n ref=$varname
        execute_sql "$ref"
    done

    echo "数据库更新完成"
}

# 检查sqlite3命令是否存在
if ! command -v sqlite3 &> /dev/null; then
    echo "警告：sqlite3 未安装，正在安装 SQLite"
    apk add sqlite
fi

# 执行主函数
main

exit 0