#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================== 简历系统服务重启脚本 v2.0 ===================${NC}"

# 检查脚本是否存在
check_scripts() {
    if [ ! -f "stop_all.sh" ]; then
        echo -e "${RED}❌ 找不到 stop_all.sh 脚本${NC}"
        exit 1
    fi
    
    if [ ! -f "start_all.sh" ]; then
        echo -e "${RED}❌ 找不到 start_all.sh 脚本${NC}"
        exit 1
    fi
    
    # 给脚本添加执行权限
    chmod +x stop_all.sh
    chmod +x start_all.sh
}

# 解析命令行参数
CLEAN_INSTALL=false
FORCE_RESTART=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --clean)
            CLEAN_INSTALL=true
            echo -e "${YELLOW}🧹 将进行清理安装${NC}"
            shift
            ;;
        --force)
            FORCE_RESTART=true
            echo -e "${YELLOW}💪 将强制重启${NC}"
            shift
            ;;
        -h|--help)
            echo -e "${WHITE}简历系统重启脚本使用说明：${NC}"
            echo -e "${CYAN}用法：${NC} ./restart_all.sh [选项]"
            echo ""
            echo -e "${WHITE}选项：${NC}"
            echo -e "  ${GREEN}--clean${NC}   清理依赖并重新安装"
            echo -e "  ${GREEN}--force${NC}   强制重启（忽略错误）"
            echo -e "  ${GREEN}-h, --help${NC}  显示此帮助信息"
            echo ""
            echo -e "${WHITE}示例：${NC}"
            echo -e "  ${CYAN}./restart_all.sh${NC}          # 普通重启"
            echo -e "  ${CYAN}./restart_all.sh --clean${NC}  # 清理重启"
            echo -e "  ${CYAN}./restart_all.sh --force${NC}  # 强制重启"
            exit 0
            ;;
        *)
            echo -e "${YELLOW}⚠️  未知参数：$1${NC}"
            shift
            ;;
    esac
done

main() {
    echo -e "${BLUE}🔄 开始重启系统服务...${NC}"
    
    # 检查脚本
    check_scripts
    
    # 步骤1：停止服务
    echo -e "${BLUE}📍 步骤 1/3：停止现有服务${NC}"
    echo -e "${CYAN}===============================================${NC}"
    
    if $FORCE_RESTART; then
        # 强制停止
        pkill -9 -f "uvicorn.*app.main:app" 2>/dev/null || true
        pkill -9 -f "react-scripts.*start" 2>/dev/null || true
        pkill -9 -f "pnpm.*start" 2>/dev/null || true
        
        # 强制释放端口
        lsof -ti:8080 | xargs kill -9 2>/dev/null || true
        lsof -ti:4000 | xargs kill -9 2>/dev/null || true
        
        echo -e "${GREEN}✅ 强制停止完成${NC}"
        sleep 2
    else
        # 优雅停止
        ./stop_all.sh
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ 服务停止失败${NC}"
            if ! $FORCE_RESTART; then
                echo -e "${YELLOW}💡 提示：使用 --force 参数强制重启${NC}"
                exit 1
            fi
        fi
    fi
    
    echo -e "${GREEN}✅ 服务停止完成${NC}"
    echo ""
    
    # 步骤2：清理（如果需要）
    if $CLEAN_INSTALL; then
        echo -e "${BLUE}📍 步骤 2/3：清理依赖和缓存${NC}"
        echo -e "${CYAN}===============================================${NC}"
        
        # 清理后端
        if [ -d "backend/venv" ]; then
            echo -e "${YELLOW}🧹 清理后端虚拟环境...${NC}"
            rm -rf backend/venv
        fi
        
        # 清理前端
        if [ -d "frontend/node_modules" ]; then
            echo -e "${YELLOW}🧹 清理前端依赖...${NC}"
            rm -rf frontend/node_modules
        fi
        
        if [ -f "frontend/pnpm-lock.yaml" ]; then
            echo -e "${YELLOW}🧹 清理前端锁定文件...${NC}"
            rm -f frontend/pnpm-lock.yaml
        fi
        
        # 清理日志
        if [ -d "logs" ]; then
            echo -e "${YELLOW}🧹 清理日志文件...${NC}"
            rm -rf logs/*.log logs/*.pid
        fi
        
        echo -e "${GREEN}✅ 清理完成${NC}"
        echo ""
    else
        echo -e "${BLUE}📍 步骤 2/3：跳过清理（使用 --clean 启用）${NC}"
        echo ""
    fi
    
    # 步骤3：启动服务
    echo -e "${BLUE}📍 步骤 3/3：启动服务${NC}"
    echo -e "${CYAN}===============================================${NC}"
    
    # 等待一下确保端口完全释放
    echo -e "${BLUE}⏳ 等待端口释放...${NC}"
    sleep 3
    
    # 启动服务
    ./start_all.sh
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 系统重启成功！${NC}"
        echo -e "${CYAN}================================================================${NC}"
        echo -e "${WHITE}🔗 访问地址：${NC}"
        echo -e "   ${CYAN}前端界面:${NC} http://localhost:4000"
        echo -e "   ${CYAN}后端API:${NC}  http://localhost:8080"
        echo -e "   ${CYAN}API文档:${NC}  http://localhost:8080/docs"
        echo ""
        echo -e "${WHITE}📊 重启类型：${NC}"
        if $CLEAN_INSTALL; then
            echo -e "   ${GREEN}✅ 清理重启${NC} - 重新安装了所有依赖"
        else
            echo -e "   ${GREEN}✅ 快速重启${NC} - 使用现有依赖"
        fi
        
        if $FORCE_RESTART; then
            echo -e "   ${YELLOW}⚡ 强制模式${NC} - 忽略了停止错误"
        fi
        
        echo -e "${CYAN}================================================================${NC}"
    else
        echo -e "${RED}❌ 系统重启失败${NC}"
        echo -e "${YELLOW}💡 建议检查日志文件：${NC}"
        echo -e "   ${CYAN}tail -f logs/backend.log${NC}"
        echo -e "   ${CYAN}tail -f logs/frontend.log${NC}"
        exit 1
    fi
}

# 信号处理
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 重启过程被中断${NC}"
    exit 1
}

trap cleanup SIGINT SIGTERM

# 运行主函数
main "$@" 