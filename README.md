# 简历上传解析系统

## 功能概述

本系统是一个基于 FastAPI + Ant Design 的简历上传和解析系统，支持 Word 格式简历文件的上传、内容解析和结构化数据存储。

## 功能特性

- ✅ 支持 Word (.docx) 格式简历上传
- ✅ 智能解析简历内容，提取关键信息
- ✅ 结构化数据存储（CSV格式）
- ✅ 现代化的Web界面
- ✅ RESTful API设计

## 提取字段

系统能够自动识别并提取以下简历信息：

- 基本信息：姓名、性别、年龄、政治面貌、体重、籍贯、健康状况、身高
- 联系方式：手机、邮箱
- 教育背景：学历、毕业院校、专业、教育经历
- 职业信息：求职意向、工作经历
- 其他信息：荣誉奖项、技能证书、兴趣爱好、自我评价

## 技术栈

### 后端
- **框架**: FastAPI
- **文档解析**: python-docx
- **数据处理**: pandas
- **文件上传**: aiofiles

### 前端
- **框架**: React + Ant Design
- **包管理**: pnpm
- **HTTP客户端**: axios

## 项目结构

```
简历系统/
├── backend/                # 后端代码
│   ├── app/
│   │   ├── main.py        # FastAPI应用入口
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   ├── requirements.txt   # Python依赖
│   └── venv/             # 虚拟环境
├── frontend/             # 前端代码
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── services/     # API服务
│   │   └── App.js       # 主应用
│   ├── package.json     # 前端依赖
│   └── public/          # 静态资源
├── data/                # 数据存储目录
│   └── resume.csv       # 简历数据
├── 简历/                # 测试简历目录
└── README.md           # 项目说明
```

## 快速开始

### 后端启动

```bash
# 创建虚拟环境
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖（使用清华镜像）
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/

# 启动服务
uvicorn app.main:app --reload --port 8000
```

### 前端启动

```bash
# 安装依赖
cd frontend
pnpm install

# 启动开发服务器
pnpm start
```

## API文档

系统启动后，可访问 `http://localhost:8000/docs` 查看完整的API文档。

## 使用说明

1. 访问前端界面 `http://localhost:3000`
2. 点击上传按钮，选择Word格式的简历文件
3. 系统自动解析并提取关键信息
4. 解析结果会增量保存到 `data/resume.csv` 文件中
5. 可在界面上查看解析结果

## 数据存储

解析后的简历数据会以CSV格式存储在 `data/resume.csv` 文件中，支持增量添加新的简历记录。 