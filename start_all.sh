#!/bin/bash

echo "=================== 简历上传解析系统一键启动脚本 ==================="

# 检查依赖
echo "检查系统环境..."

# 检查Python
if ! command -v python &> /dev/null; then
    echo "错误: 未检测到Python，请先安装Python 3.8+"
    exit 1
fi

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    exit 1
fi

echo "环境检查通过！"

# 给启动脚本添加执行权限
chmod +x start_backend.sh
chmod +x start_frontend.sh

echo "开始启动服务..."

# 启动后端服务（后台运行）
echo "启动后端服务..."
gnome-terminal --title="简历系统后端" -- bash -c "./start_backend.sh; exec bash" 2>/dev/null || \
xterm -T "简历系统后端" -e "./start_backend.sh" 2>/dev/null || \
echo "后台启动后端服务..." && nohup ./start_backend.sh > backend.log 2>&1 &

# 等待后端启动
echo "等待后端服务启动..."
sleep 5

# 启动前端服务
echo "启动前端服务..."
gnome-terminal --title="简历系统前端" -- bash -c "./start_frontend.sh; exec bash" 2>/dev/null || \
xterm -T "简历系统前端" -e "./start_frontend.sh" 2>/dev/null || \
echo "后台启动前端服务..." && nohup ./start_frontend.sh > frontend.log 2>&1 &

echo "=========================================================="
echo "✅ 系统启动完成！"
echo ""
echo "🔗 访问地址："
echo "   前端界面: http://localhost:4000"
echo "   后端API:  http://localhost:8080"
echo "   API文档:  http://localhost:8080/docs"
echo ""
echo "📁 项目结构："
echo "   📂 backend/     - FastAPI后端服务"
echo "   📂 frontend/    - React前端应用"
echo "   📂 data/        - CSV数据存储"
echo "   📂 简历/        - 测试简历文件"
echo ""
echo "💡 使用说明："
echo "   1. 打开浏览器访问 http://localhost:4000"
echo "   2. 在'简历上传'页面上传.docx格式的简历文件"
echo "   3. 系统会自动解析并在'简历列表'中显示结果"
echo "   4. 数据会自动保存到 data/resume.csv 文件中"
echo ""
echo "⚠️  注意事项："
echo "   - 仅支持 .docx 格式的简历文件"
echo "   - 文件大小限制为 10MB"
echo "   - 确保端口 4000 和 8080 未被占用"
echo ""
echo "🛑 停止服务："
echo "   按 Ctrl+C 或关闭终端窗口"
echo "==========================================================" 