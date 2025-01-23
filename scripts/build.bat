@echo off 
cls
echo off
echo.
echo ----------------------------GoLand 编译----------------------------------
echo. ----------------------------by ohxing-----------------------------------

echo.
echo ----------------------------按"a"键 选择 构建后继续执行---------------------
echo ----------------------------按"b"键 选择 构建后不执行-----------------------
echo ----------------------------按"q"键 选择 退出----------------------------
echo.
SET /P choice=请选择操作项:
IF /I '%Choice:~0,1%'=='a' SET isRun=y
IF /I '%Choice:~0,1%'=='b' SET isRun=n
IF /I '%Choice:~0,1%'=='q' exit


echo.
echo ----------------------------按"a"键 选择 amd64版本---------------------------- 
echo ----------------------------按"r"键 选择 arm64版本----------------------------
echo ----------------------------按"x"键 选择 x86版本----------------------------
echo ----------------------------按"q"键 选择 退出---------------------------- 
echo. -----------------------------------by ohxing----------------------------------- 
echo. 
SET /P choice=请选择操作项:
IF /I '%Choice:~0,1%'=='a' SET GOARCH=amd64
IF /I '%Choice:~0,1%'=='r' SET GOARCH=arm64
IF /I '%Choice:~0,1%'=='x' SET GOARCH=x86
IF /I '%Choice:~0,1%'=='q' exit
echo 编译目标处理器架构：%GOARCH%

SET OUT=bin\next-terminal.exe

:: 禁用CGO
SET CGO_ENABLED=0
:: 目标平台是linux
SET GOOS=windows
:: 目标处理器架构是amd64
SET GOARCH=%GOARCH%

echo 开始编译....

:: SET PROXY=https://goproxy.io,direct
:: SET PROXY=https://goproxy.cn,direct
:: SET PROXY=https://mirrors.aliyun.com/goproxy/,direct

:: go env -w GOPROXY=$PROXY

cd ..
copy /Y "build\resources\logo.png" "web\src\images\logo.png"
copy /Y "build\resources\logo-with-name.png" "web\src\images\logo-with-name.png"
copy /Y "build\resources\favicon.ico" "web\public\favicon.ico"

::del server\resource\build
echo "clean build history"

echo "build web..."

cd web
yarn install
yarn build
copy  /Y "build" "..\server\resource"

echo "build web success"

echo "build api..."

cd ..
go mod tidy
go build -o %OUT% -ldflags "-s -w"  main.go

upx %OUT%

echo "build api success"

echo "开始运行"
if "%isRun%"=="y" (
    %OUT%
)
