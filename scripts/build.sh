#!/bin/bash


OUT=../bin/XrayR.exe

PROXY=https://goproxy.io,direct
PROXY=https://goproxy.cn,direct
PROXY=https://mirrors.aliyun.com/goproxy/,direct

go env -w GOPROXY=$PROXY

GOOS=

while [ 1 ]
  do
    echo 编译目标平台 w: windows / l: linux / d: darwin / q: quit
    read -p "选择:" GOOS
    if [[ "${GOOS}" = "w" ]]; then
      GOOS=windows
    elif [[ "${GOOS}" = "l" ]]; then
      GOOS=linux
    elif [[ "${GOOS}" = "d" ]]; then
      GOOS=darwin
    elif [[ "${GOOS}" = "q" ]]; then
      exit 0
    else
      continue
    fi

    break
  done

echo "编译目标平台: ${GOOS}"


GOARCH=

while [ 1 ]
  do
    echo 编译目标处理器架构 a: amd64 / r: arm64 / x: x86 / q: quit
    read -p "选择:" GOARCH
    if [[ "${GOARCH}" = "a" ]]; then
      GOARCH=amd64
    elif [[ "${GOARCH}" = "r" ]]; then
      GOARCH=arm64
    elif [[ "${GOARCH}" = "x" ]]; then
        GOARCH=x86
    elif [[ "${GOARCH}" = "q" ]]; then
      exit 0
    else
      continue
    fi

    break
  done

echo "编译目标处理器架构: ${GOARCH}"

echo 开始编译....

export CGO_ENABLED=0 GOOS=${GOOS} GOARCH=${GOARCH}

go mod tidy

go build -o %OUT% -ldflags "-s -w" ../main
