#!/bin/bash

echo "=================== 简历上传解析系统一键启动脚本 ==================="

# 检查依赖
echo "检查系统环境..."

# 检查Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "错误: 未检测到Python，请先安装Python 3.8+"
    exit 1
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

# 检查pnpm
if ! command -v pnpm &> /dev/null; then
    echo "安装pnpm..."
    npm install -g pnpm
fi

echo "环境检查通过！"

# 创建日志目录
mkdir -p logs

# 检查端口占用
echo "检查端口占用..."
if lsof -i:8080 &> /dev/null; then
    echo "警告: 端口8080已被占用，正在释放..."
    pkill -f "uvicorn.*8080" || true
    sleep 2
fi

if lsof -i:4000 &> /dev/null; then
    echo "警告: 端口4000已被占用，正在释放..."
    pkill -f "react-scripts.*4000" || true
    sleep 2
fi

echo "开始启动服务..."

# 启动后端服务
echo "启动后端服务..."
cd backend

# 检查并创建虚拟环境
if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv || python -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装后端依赖..."
pip install -r requirements.txt > ../logs/backend_install.log 2>&1

# 后台启动后端
echo "启动FastAPI服务器..."
nohup uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid

cd ..

# 等待后端启动
echo "等待后端服务启动..."
sleep 3

# 启动前端服务
echo "启动前端服务..."
cd frontend

# 安装前端依赖
echo "安装前端依赖..."
pnpm install > ../logs/frontend_install.log 2>&1

# 后台启动前端
echo "启动React开发服务器..."
nohup pnpm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid

cd ..

# 等待服务完全启动
echo "等待服务完全启动..."
sleep 5

echo "=========================================================="
echo "✅ 系统启动完成！"
echo ""
echo "🔗 访问地址："
echo "   前端界面: http://localhost:4000"
echo "   后端API:  http://localhost:8080"
echo "   API文档:  http://localhost:8080/docs"
echo ""
echo "📋 进程信息："
echo "   后端PID: $BACKEND_PID"
echo "   前端PID: $FRONTEND_PID"
echo ""
echo "📁 日志文件："
echo "   后端日志: logs/backend.log"
echo "   前端日志: logs/frontend.log"
echo ""
echo "💡 使用说明："
echo "   1. 打开浏览器访问 http://localhost:4000"
echo "   2. 在'简历上传'页面上传.docx或.pdf格式的简历文件"
echo "   3. 系统会自动解析并在'简历列表'中显示结果"
echo "   4. 数据会自动保存到 data/resume.csv 文件中"
echo ""
echo "⚠️  注意事项："
echo "   - 支持 .docx 和 .pdf 格式的简历文件"
echo "   - 文件大小限制为 10MB"
echo "   - 确保端口 4000 和 8080 未被占用"
echo ""
echo "🛑 停止服务："
echo "   运行: ./stop_all.sh"
echo "   或使用: pkill -f uvicorn && pkill -f react-scripts"
echo "=========================================================="

# 检查服务是否成功启动
sleep 2
if ps -p $BACKEND_PID > /dev/null; then
    echo "✅ 后端服务启动成功 (PID: $BACKEND_PID)"
else
    echo "❌ 后端服务启动失败，请查看 logs/backend.log"
fi

if ps -p $FRONTEND_PID > /dev/null; then
    echo "✅ 前端服务启动成功 (PID: $FRONTEND_PID)"
else
    echo "❌ 前端服务启动失败，请查看 logs/frontend.log"
fi 