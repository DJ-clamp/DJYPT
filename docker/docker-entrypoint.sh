#!/bin/bash
set -e

echo -e "\n========================1. 更新源代码========================\n"
[ ! -d ${JD_DIR}/log ] && mkdir -p ${JD_DIR}/log
crond

echo -e "========================2. 检测配置文件========================\n"
if [ -d ${JD_DIR}/config ]
then

  if [ -s ${JD_DIR}/config/crontab.list ]
  then
    echo -e "检测到config配置目录下存在crontab.list，自动导入定时任务...\n"
    crontab ${JD_DIR}/config/crontab.list
    echo -e "成功添加定时任务...\n"
  else
    echo -e "检测到config配置目录下不存在crontab.list或存在但文件为空，从示例文件复制一份用于始化...\n"
    cp -fv ${JD_DIR}/sample/docker.list.sample ${JD_DIR}/config/crontab.list
    echo
    crontab ${JD_DIR}/config/crontab.list
    echo -e "成功添加定时任务...\n"
  fi

  if [ ! -s ${JD_DIR}/config/config.sh ]; then
    echo -e "检测到config配置目录下不存在config.sh，从示例文件复制一份用于始化...\n"
    cp -fv ${JD_DIR}/sample/config.sh.sample ${JD_DIR}/config/config.sh
    echo
  fi

else
  echo -e "没有映射config配置目录给本容器，请先按教程映射config配置目录...\n"
  exit 1
fi

if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then
  set -- node "$@"
fi

exec "$@"