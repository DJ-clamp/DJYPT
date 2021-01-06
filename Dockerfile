FROM node:lts-alpine
LABEL maintainer="CLAMP"
ARG JD_BASE_URL=https://github.com/DJ-clamp/DJYPT.git
ARG JD_BASE_BRANCH=main
ARG JD_SCRIPTS_URL=https://github.com/lxk0301/jd_scripts
ARG JD_SCRIPTS_BRANCH=master
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
    LANG=zh_CN.UTF-8 \
    SHELL=/bin/bash \
    PS1="\u@\h:\w \$ " \
    # 填写需要登录得用户id用@符号区分
    DJ_USERNAME="" \ 
    JD_DIR=/DJYPT
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories \
    && apk update -f \
    && apk upgrade \
    && apk --no-cache add -f bash \
    coreutils \
    moreutils \
    git \
    wget \
    curl \
    nano \
    tzdata \
    perl \
    openssl \
    && rm -rf /var/cache/apk/* \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && git clone -b ${JD_BASE_BRANCH} ${JD_BASE_URL} ${JD_DIR} \
    # && git clone -b ${JD_SCRIPTS_BRANCH} ${JD_SCRIPTS_URL} ${JD_DIR}/scripts \
    && cd ${JD_DIR} \
    && npm install \
    # && ln -sf ${JD_DIR}/jd.sh /usr/local/bin/jd \
    # && ln -sf ${JD_DIR}/git_pull.sh /usr/local/bin/git_pull \
    # && ln -sf ${JD_DIR}/rm_log.sh /usr/local/bin/rm_log \
    # && ln -sf ${JD_DIR}/export_sharecodes.sh /usr/local/bin/export_sharecodes \
    && cp -f ${JD_DIR}/docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh \
    && chmod 777 /usr/local/bin/docker-entrypoint.sh
WORKDIR ${JD_DIR}
ENTRYPOINT docker-entrypoint.sh