#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# 配置
BACKEND_PORT=8080
FRONTEND_PORT=4000

echo -e "${CYAN}=================== 简历系统服务停止脚本 v2.0 ===================${NC}"

# 显示进度条
show_progress() {
    local current=$1
    local total=$2
    local message=$3
    local percent=$((current * 100 / total))
    local bar_length=20
    local filled_length=$((percent * bar_length / 100))
    
    printf "\r${BLUE}[${NC}"
    for ((i=0; i<filled_length; i++)); do printf "█"; done
    for ((i=filled_length; i<bar_length; i++)); do printf "░"; done
    printf "${BLUE}] ${percent}%% ${message}${NC}"
    
    if [ $current -eq $total ]; then
        echo ""
    fi
}

# 停止进程
stop_process() {
    local pid=$1
    local name=$2
    local timeout=${3:-10}
    
    if [ -z "$pid" ] || ! ps -p $pid > /dev/null 2>&1; then
        return 0
    fi
    
    echo -e "${BLUE}🛑 停止 $name (PID: $pid)...${NC}"
    
    # 优雅停止
    kill -TERM $pid 2>/dev/null
    
    # 等待进程停止
    local count=0
    while [ $count -lt $timeout ] && ps -p $pid > /dev/null 2>&1; do
        show_progress $count $timeout "等待进程停止..."
        sleep 1
        count=$((count + 1))
    done
    
    # 如果进程仍在运行，强制停止
    if ps -p $pid > /dev/null 2>&1; then
        echo -e "\n${YELLOW}⚠️  强制停止 $name...${NC}"
        kill -KILL $pid 2>/dev/null
        sleep 1
    fi
    
    if ps -p $pid > /dev/null 2>&1; then
        echo -e "${RED}❌ 无法停止 $name${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $name 已停止${NC}"
        return 0
    fi
}

# 停止端口占用的进程
stop_port() {
    local port=$1
    local service_name=$2
    
    echo -e "${BLUE}🔍 检查端口 $port ($service_name)...${NC}"
    
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ -z "$pids" ]; then
        echo -e "${GREEN}✅ 端口 $port 未被占用${NC}"
        return 0
    fi
    
    echo -e "${YELLOW}⚠️  发现端口 $port 被占用${NC}"
    
    for pid in $pids; do
        if ps -p $pid > /dev/null 2>&1; then
            local process_name=$(ps -p $pid -o comm= 2>/dev/null)
            stop_process $pid "$service_name ($process_name)" 5
        fi
    done
}

# 清理PID文件
cleanup_pid_files() {
    echo -e "${BLUE}🧹 清理PID文件...${NC}"
    
    if [ -f "logs/backend.pid" ]; then
        local backend_pid=$(cat logs/backend.pid 2>/dev/null)
        if [ ! -z "$backend_pid" ]; then
            stop_process $backend_pid "后端服务"
        fi
        rm -f logs/backend.pid
    fi
    
    if [ -f "logs/frontend.pid" ]; then
        local frontend_pid=$(cat logs/frontend.pid 2>/dev/null)
        if [ ! -z "$frontend_pid" ]; then
            stop_process $frontend_pid "前端服务"
        fi
        rm -f logs/frontend.pid
    fi
    
    echo -e "${GREEN}✅ PID文件清理完成${NC}"
}

# 停止已知进程类型
stop_known_processes() {
    echo -e "${BLUE}🔍 查找并停止已知进程...${NC}"
    
    # 停止uvicorn进程
    local uvicorn_pids=$(pgrep -f "uvicorn.*app.main:app" 2>/dev/null)
    if [ ! -z "$uvicorn_pids" ]; then
        for pid in $uvicorn_pids; do
            stop_process $pid "FastAPI后端服务"
        done
    fi
    
    # 停止React开发服务器
    local react_pids=$(pgrep -f "react-scripts.*start" 2>/dev/null)
    if [ ! -z "$react_pids" ]; then
        for pid in $react_pids; do
            stop_process $pid "React开发服务器"
        done
    fi
    
    # 停止pnpm start进程
    local pnpm_pids=$(pgrep -f "pnpm.*start" 2>/dev/null)
    if [ ! -z "$pnpm_pids" ]; then
        for pid in $pnpm_pids; do
            stop_process $pid "pnpm启动进程"
        done
    fi
    
    echo -e "${GREEN}✅ 已知进程清理完成${NC}"
}

# 检查服务状态
check_service_status() {
    echo -e "${BLUE}📊 检查服务状态...${NC}"
    
    local backend_running=false
    local frontend_running=false
    
    # 检查后端
    if lsof -ti:$BACKEND_PORT > /dev/null 2>&1; then
        backend_running=true
        echo -e "${YELLOW}⚠️  后端服务仍在运行 (端口 $BACKEND_PORT)${NC}"
    else
        echo -e "${GREEN}✅ 后端服务已停止${NC}"
    fi
    
    # 检查前端
    if lsof -ti:$FRONTEND_PORT > /dev/null 2>&1; then
        frontend_running=true
        echo -e "${YELLOW}⚠️  前端服务仍在运行 (端口 $FRONTEND_PORT)${NC}"
    else
        echo -e "${GREEN}✅ 前端服务已停止${NC}"
    fi
    
    if $backend_running || $frontend_running; then
        return 1
    else
        return 0
    fi
}

# 主函数
main() {
    echo -e "${BLUE}🛑 开始停止所有服务...${NC}"
    
    # 清理PID文件中的进程
    cleanup_pid_files
    
    # 停止已知进程类型
    stop_known_processes
    
    # 停止端口占用的进程
    stop_port $BACKEND_PORT "后端服务"
    stop_port $FRONTEND_PORT "前端服务"
    
    # 检查服务状态
    echo ""
    if check_service_status; then
        echo -e "${GREEN}🎉 所有服务已成功停止！${NC}"
        echo -e "${CYAN}================================================================${NC}"
        echo -e "${WHITE}📊 服务状态：${NC}"
        echo -e "   ${GREEN}✅ 后端服务${NC} (端口 $BACKEND_PORT)"
        echo -e "   ${GREEN}✅ 前端服务${NC} (端口 $FRONTEND_PORT)"
        echo ""
        echo -e "${WHITE}🚀 重新启动服务：${NC}"
        echo -e "   ${CYAN}./start_all.sh${NC}     - 一键启动所有服务"
        echo -e "   ${CYAN}./restart_all.sh${NC}   - 重启所有服务"
        echo -e "${CYAN}================================================================${NC}"
    else
        echo -e "${YELLOW}⚠️  部分服务可能仍在运行${NC}"
        echo -e "${WHITE}如需强制停止，请使用：${NC}"
        echo -e "   ${CYAN}sudo lsof -ti:$BACKEND_PORT,$FRONTEND_PORT | xargs kill -9${NC}"
        exit 1
    fi
}

# 运行主函数
main "$@" 