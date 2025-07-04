#!/bin/bash

echo "=================== 简历上传解析系统后端启动脚本 ==================="

# 进入后端目录
cd backend

# 检查虚拟环境是否存在
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python -m venv venv
fi

# 激活虚拟环境
echo "激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "安装Python依赖包..."
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 确保data目录存在
echo "创建数据目录..."
mkdir -p ../data

# 启动FastAPI服务
echo "启动FastAPI服务..."
echo "服务地址: http://localhost:8080"
echo "API文档: http://localhost:8080/docs"
echo "按 Ctrl+C 停止服务"
echo "=========================================================="

uvicorn app.main:app --reload --host 0.0.0.0 --port 8080 