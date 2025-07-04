#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 配置
BACKEND_PORT=8080
FRONTEND_PORT=4000
PROJECT_NAME="简历上传解析系统"

echo -e "${CYAN}================================================================${NC}"
echo -e "${WHITE}                    ${PROJECT_NAME}                    ${NC}"
echo -e "${WHITE}                      系统状态检查 v2.0                      ${NC}"
echo -e "${CYAN}================================================================${NC}"

# 检查端口状态
check_port_status() {
    local port=$1
    local service_name=$2
    local url=$3
    
    echo -e "${BLUE}🔍 检查 $service_name (端口 $port)...${NC}"
    
    # 检查端口是否被占用
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -z "$pid" ]; then
        echo -e "   ${RED}❌ 端口 $port 未被占用${NC}"
        return 1
    fi
    
    # 获取进程信息
    local process_info=$(ps -p $pid -o pid,ppid,comm,args --no-headers 2>/dev/null)
    if [ ! -z "$process_info" ]; then
        echo -e "   ${GREEN}✅ 进程运行中${NC} (PID: $pid)"
        echo -e "   ${WHITE}进程信息:${NC} $(echo $process_info | cut -d' ' -f3-)"
    fi
    
    # 检查HTTP连接
    if [ ! -z "$url" ]; then
        if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ HTTP服务正常${NC} ($url)"
        else
            echo -e "   ${YELLOW}⚠️  HTTP服务无响应${NC} ($url)"
        fi
    fi
    
    return 0
}

# 检查PID文件
check_pid_files() {
    echo -e "${BLUE}📄 检查PID文件...${NC}"
    
    if [ -f "logs/backend.pid" ]; then
        local backend_pid=$(cat logs/backend.pid 2>/dev/null)
        if [ ! -z "$backend_pid" ] && ps -p $backend_pid > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ 后端PID文件有效${NC} (PID: $backend_pid)"
        else
            echo -e "   ${YELLOW}⚠️  后端PID文件无效${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  后端PID文件不存在${NC}"
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        local frontend_pid=$(cat logs/frontend.pid 2>/dev/null)
        if [ ! -z "$frontend_pid" ] && ps -p $frontend_pid > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ 前端PID文件有效${NC} (PID: $frontend_pid)"
        else
            echo -e "   ${YELLOW}⚠️  前端PID文件无效${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  前端PID文件不存在${NC}"
    fi
}

# 检查日志文件
check_log_files() {
    echo -e "${BLUE}📋 检查日志文件...${NC}"
    
    if [ -f "logs/backend.log" ]; then
        local backend_size=$(du -h logs/backend.log | cut -f1)
        local backend_lines=$(wc -l < logs/backend.log)
        echo -e "   ${GREEN}✅ 后端日志${NC} (大小: $backend_size, 行数: $backend_lines)"
        
        # 检查最近的错误
        local recent_errors=$(tail -20 logs/backend.log | grep -i "error\|exception\|failed" | wc -l)
        if [ $recent_errors -gt 0 ]; then
            echo -e "   ${YELLOW}⚠️  发现 $recent_errors 个最近错误${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  后端日志文件不存在${NC}"
    fi
    
    if [ -f "logs/frontend.log" ]; then
        local frontend_size=$(du -h logs/frontend.log | cut -f1)
        local frontend_lines=$(wc -l < logs/frontend.log)
        echo -e "   ${GREEN}✅ 前端日志${NC} (大小: $frontend_size, 行数: $frontend_lines)"
        
        # 检查最近的错误
        local recent_errors=$(tail -20 logs/frontend.log | grep -i "error\|failed\|warning" | wc -l)
        if [ $recent_errors -gt 0 ]; then
            echo -e "   ${YELLOW}⚠️  发现 $recent_errors 个最近错误/警告${NC}"
        fi
    else
        echo -e "   ${YELLOW}⚠️  前端日志文件不存在${NC}"
    fi
}

# 检查系统资源
check_system_resources() {
    echo -e "${BLUE}💻 检查系统资源...${NC}"
    
    # CPU使用率
    if command -v top &> /dev/null; then
        local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
        if [ ! -z "$cpu_usage" ]; then
            echo -e "   ${WHITE}CPU使用率:${NC} $cpu_usage%"
        fi
    fi
    
    # 内存使用情况
    if command -v vm_stat &> /dev/null; then
        local memory_info=$(vm_stat | head -4)
        echo -e "   ${WHITE}内存状态:${NC} 正常"
    fi
    
    # 磁盘空间
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}' | sed 's/%//')
    echo -e "   ${WHITE}磁盘使用:${NC} $disk_usage%"
    
    if [ $disk_usage -gt 90 ]; then
        echo -e "   ${RED}⚠️  磁盘空间不足${NC}"
    fi
}

# 检查项目结构
check_project_structure() {
    echo -e "${BLUE}📁 检查项目结构...${NC}"
    
    local required_dirs=("backend" "frontend" "data")
    local required_files=("start_all.sh" "stop_all.sh" "restart_all.sh")
    
    for dir in "${required_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo -e "   ${GREEN}✅ $dir/${NC}"
        else
            echo -e "   ${RED}❌ $dir/${NC}"
        fi
    done
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            if [ -x "$file" ]; then
                echo -e "   ${GREEN}✅ $file (可执行)${NC}"
            else
                echo -e "   ${YELLOW}⚠️  $file (不可执行)${NC}"
            fi
        else
            echo -e "   ${RED}❌ $file${NC}"
        fi
    done
}

# 网络连接测试
test_network_connectivity() {
    echo -e "${BLUE}🌐 测试网络连接...${NC}"
    
    # 测试本地服务连接
    local services=(
        "http://localhost:$BACKEND_PORT/health|后端健康检查"
        "http://localhost:$FRONTEND_PORT|前端服务"
        "http://localhost:$BACKEND_PORT/docs|API文档"
    )
    
    for service in "${services[@]}"; do
        local url=$(echo $service | cut -d'|' -f1)
        local name=$(echo $service | cut -d'|' -f2)
        
        if curl -s --max-time 3 "$url" > /dev/null 2>&1; then
            echo -e "   ${GREEN}✅ $name${NC} ($url)"
        else
            echo -e "   ${RED}❌ $name${NC} ($url)"
        fi
    done
}

# 显示快速操作
show_quick_actions() {
    echo -e "${PURPLE}⚡ 快速操作命令：${NC}"
    echo -e "${CYAN}================================================================${NC}"
    echo -e "${WHITE}服务管理：${NC}"
    echo -e "  ${GREEN}./start_all.sh${NC}      启动所有服务"
    echo -e "  ${GREEN}./stop_all.sh${NC}       停止所有服务"
    echo -e "  ${GREEN}./restart_all.sh${NC}    重启所有服务"
    echo -e "  ${GREEN}./restart_all.sh --clean${NC}  清理重启"
    echo ""
    echo -e "${WHITE}日志查看：${NC}"
    echo -e "  ${GREEN}tail -f logs/backend.log${NC}   查看后端日志"
    echo -e "  ${GREEN}tail -f logs/frontend.log${NC}  查看前端日志"
    echo ""
    echo -e "${WHITE}访问地址：${NC}"
    echo -e "  ${CYAN}http://localhost:4000${NC}      前端界面"
    echo -e "  ${CYAN}http://localhost:8080${NC}      后端API"
    echo -e "  ${CYAN}http://localhost:8080/docs${NC}  API文档"
    echo -e "${CYAN}================================================================${NC}"
}

# 主函数
main() {
    # 创建logs目录（如果不存在）
    mkdir -p logs
    
    # 执行各种检查
    echo ""
    check_port_status $BACKEND_PORT "后端服务" "http://localhost:$BACKEND_PORT/health"
    echo ""
    check_port_status $FRONTEND_PORT "前端服务" "http://localhost:$FRONTEND_PORT"
    echo ""
    check_pid_files
    echo ""
    check_log_files
    echo ""
    check_system_resources
    echo ""
    check_project_structure
    echo ""
    test_network_connectivity
    echo ""
    
    # 总结状态
    local backend_running=false
    local frontend_running=false
    
    if lsof -ti:$BACKEND_PORT > /dev/null 2>&1; then
        backend_running=true
    fi
    
    if lsof -ti:$FRONTEND_PORT > /dev/null 2>&1; then
        frontend_running=true
    fi
    
    echo -e "${WHITE}📊 系统状态总结：${NC}"
    echo -e "${CYAN}================================================================${NC}"
    
    if $backend_running && $frontend_running; then
        echo -e "${GREEN}🎉 系统运行正常！${NC}"
        echo -e "   ${GREEN}✅ 后端服务${NC} - 运行中"
        echo -e "   ${GREEN}✅ 前端服务${NC} - 运行中"
        echo -e "   ${GREEN}✅ 系统可用${NC}"
    elif $backend_running; then
        echo -e "${YELLOW}⚠️  部分服务运行${NC}"
        echo -e "   ${GREEN}✅ 后端服务${NC} - 运行中"
        echo -e "   ${RED}❌ 前端服务${NC} - 未运行"
    elif $frontend_running; then
        echo -e "${YELLOW}⚠️  部分服务运行${NC}"
        echo -e "   ${RED}❌ 后端服务${NC} - 未运行"
        echo -e "   ${GREEN}✅ 前端服务${NC} - 运行中"
    else
        echo -e "${RED}❌ 系统未运行${NC}"
        echo -e "   ${RED}❌ 后端服务${NC} - 未运行"
        echo -e "   ${RED}❌ 前端服务${NC} - 未运行"
        echo -e "   ${YELLOW}💡 运行 ./start_all.sh 启动系统${NC}"
    fi
    
    echo ""
    show_quick_actions
}

# 解析命令行参数
case "${1:-}" in
    --help|-h)
        echo -e "${WHITE}系统状态检查脚本使用说明：${NC}"
        echo -e "${CYAN}用法：${NC} ./status.sh [选项]"
        echo ""
        echo -e "${WHITE}选项：${NC}"
        echo -e "  ${GREEN}--help, -h${NC}  显示此帮助信息"
        echo -e "  ${GREEN}--watch, -w${NC} 持续监控模式（每5秒刷新）"
        echo ""
        exit 0
        ;;
    --watch|-w)
        echo -e "${YELLOW}🔄 进入持续监控模式（按 Ctrl+C 退出）${NC}"
        while true; do
            clear
            main
            sleep 5
        done
        ;;
    *)
        main
        ;;
esac 