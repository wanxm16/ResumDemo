#!/bin/bash

echo "=================== 简历上传解析系统前端启动脚本 ==================="

# 进入前端目录
cd frontend

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

# 检查pnpm是否安装
if ! command -v pnpm &> /dev/null; then
    echo "安装pnpm..."
    npm install -g pnpm
fi

# 安装依赖
echo "安装前端依赖包..."
pnpm install

# 启动开发服务器
echo "启动React开发服务器..."
echo "前端地址: http://localhost:4000"
echo "请确保后端服务已启动 (http://localhost:8080)"
echo "按 Ctrl+C 停止服务"
echo "=========================================================="

PORT=4000 pnpm start 