# 简历上传解析系统

## 功能概述

本系统是一个基于 FastAPI + React + Ant Design 的现代化简历管理系统，支持多种格式简历文件的上传、智能解析、数据可视化和AI生成功能。

## 🚀 功能特性

### 核心功能
- ✅ 支持 Word (.docx) 和 PDF 格式简历上传
- ✅ 智能解析简历内容，支持表格格式简历
- ✅ AI生成测试简历数据（基于DeepSeek）
- ✅ 在线简历表单填写
- ✅ 结构化数据存储（CSV格式）
- ✅ Word格式简历导出

### 界面功能
- ✅ 现代化首页设计，功能介绍和快速导航
- ✅ 统计数据可视化（饼图、柱状图、面积图、折线图）
- ✅ 简历列表查看、搜索和删除
- ✅ 响应式设计，适配多种设备

### 数据分析
- ✅ 多维度统计分析（性别、学历、年龄、专业等）
- ✅ 热门专业/院校/求职意向TOP10
- ✅ 工作年限和录入时间分布
- ✅ 实时数据更新和可视化展示

## 📊 提取字段

系统能够自动识别并提取以下简历信息：

- **基本信息**：姓名、性别、年龄、政治面貌、体重、籍贯、健康状况、身高
- **联系方式**：手机、邮箱（支持多种格式识别）
- **教育背景**：学历、毕业院校、专业、教育经历（含时间段）
- **职业信息**：求职意向、工作经历（含时间段和职责）
- **其他信息**：荣誉奖项、技能证书、兴趣爱好、自我评价

## 🛠 技术栈

### 后端
- **框架**: FastAPI
- **文档解析**: python-docx, pdfplumber, easyocr
- **数据处理**: pandas
- **AI集成**: DeepSeek API
- **文件处理**: aiofiles, tempfile

### 前端
- **框架**: React + Ant Design
- **图表库**: Recharts
- **包管理**: pnpm
- **HTTP客户端**: axios
- **状态管理**: React Hooks

## 📁 项目结构

```
简历系统/
├── backend/                # 后端代码
│   ├── app/
│   │   ├── main.py        # FastAPI应用入口
│   │   ├── models.py      # 数据模型
│   │   └── services/      # 业务逻辑
│   │       ├── data_storage.py    # 数据存储服务
│   │       └── resume_parser.py   # 简历解析服务
│   ├── requirements.txt   # Python依赖
│   └── venv/             # 虚拟环境
├── frontend/             # 前端代码
│   ├── src/
│   │   ├── components/   # React组件
│   │   │   ├── HomePage.js        # 首页
│   │   │   ├── Statistics.js      # 统计页面
│   │   │   ├── ResumeList.js      # 简历列表
│   │   │   ├── ResumeUpload.js    # 文件上传
│   │   │   ├── ResumeForm.js      # 表单填写
│   │   │   └── ResumeDetail.js    # 简历详情
│   │   ├── services/     # API服务
│   │   └── App.js       # 主应用
│   ├── package.json     # 前端依赖
│   └── public/          # 静态资源
├── data/                # 数据存储目录
│   └── resume.csv       # 简历数据
├── 简历/                # 测试简历目录
├── start_all.sh         # 一键启动脚本
├── start_backend.sh     # 后端启动脚本
├── start_frontend.sh    # 前端启动脚本
└── README.md           # 项目说明
```

## 🚀 快速开始

### 一键启动（推荐）

```bash
# 赋予执行权限
chmod +x start_all.sh

# 一键启动前后端
./start_all.sh
```

### 手动启动

#### 后端启动

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（首次运行）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 启动服务
uvicorn app.main:app --reload --port 8080
```

#### 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
pnpm install

# 启动开发服务器
PORT=4000 pnpm start
```

## 🌐 访问地址

- **前端界面**: http://localhost:4000
- **后端API**: http://localhost:8080
- **API文档**: http://localhost:8080/docs

## 📖 使用说明

### 1. 首页导航
- 访问 http://localhost:4000 查看系统首页
- 了解系统功能特色和使用指南
- 快速导航到各个功能模块

### 2. 简历录入
**文件上传**：
- 支持 .docx 和 .pdf 格式
- 智能解析表格和文本格式
- 自动提取邮箱和时间信息

**在线填写**：
- 完整的表单界面
- 实时数据验证
- 支持多段教育和工作经历

### 3. AI生成
- 基于DeepSeek AI生成测试数据
- 多样化的个人信息和背景
- 真实的教育和工作经历

### 4. 数据管理
- 简历列表查看和搜索
- 支持按关键词、年龄、工作年限筛选
- 一键删除和Word导出功能

### 5. 统计分析
- 实时统计数据展示
- 多种图表可视化
- 热门趋势分析

## 📊 数据存储

解析后的简历数据以CSV格式存储在 `data/resume.csv` 文件中：
- 支持增量添加新记录
- 自动生成录入时间戳
- 结构化JSON格式存储复杂字段

## 🔧 开发说明

### 环境要求
- Python 3.8+
- Node.js 16+
- pnpm 8+

### 开发模式
- 后端支持热重载
- 前端支持实时编译
- API文档自动生成

### 扩展功能
- 支持更多文件格式
- 增加更多统计维度
- 集成更多AI服务

## 📝 更新日志

### v2.0.0 (2025-01-04)
- 🎨 全新首页设计和导航优化
- 📊 完整的统计分析和可视化功能
- 🤖 AI生成简历数据功能
- 🔧 优化解析器，支持表格格式
- 🐛 修复邮箱解析和时间格式问题

### v1.0.0 (2024-12-01)
- 🚀 基础的简历上传和解析功能
- 📋 简历列表查看和管理
- 💾 CSV数据存储
- 🌐 Web界面和API接口

## 📄 License

MIT License 