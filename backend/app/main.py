import os
import tempfile
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
from pydantic import BaseModel

from .models import UploadResponse, ResumeData
from .services.resume_parser import ResumeParser
from .services.data_storage import DataStorage

# 创建FastAPI应用
app = FastAPI(
    title="简历上传解析系统",
    description="支持Word格式简历的上传、解析和数据存储",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # 允许前端访问
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 表单数据模型
class ResumeFormData(BaseModel):
    姓名: Optional[str] = ""
    性别: Optional[str] = ""
    年龄: Optional[str] = ""
    政治面貌: Optional[str] = ""
    体重: Optional[str] = ""
    籍贯: Optional[str] = ""
    健康状况: Optional[str] = ""
    身高: Optional[str] = ""
    学历: Optional[str] = ""
    毕业院校: Optional[str] = ""
    专业: Optional[str] = ""
    求职意向: Optional[str] = ""
    手机: Optional[str] = ""
    邮箱: Optional[str] = ""
    教育经历: Optional[str] = ""
    荣誉奖项: Optional[str] = ""
    技能证书: Optional[str] = ""
    工作经历: Optional[str] = ""
    兴趣爱好: Optional[str] = ""
    自我评价: Optional[str] = ""

# 初始化服务
resume_parser = ResumeParser()
# 使用绝对路径确保在任何工作目录下都能找到CSV文件
import os
# 获取项目根目录（backend的上级目录）
project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
csv_path = os.path.join(project_root, "data", "resume.csv")
data_storage = DataStorage(csv_path)


@app.get("/")
async def root():
    """根路径"""
    return {"message": "简历上传解析系统 API", "version": "1.0.0"}


@app.post("/upload", response_model=UploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """
    上传并解析简历文件
    
    支持的文件格式：
    - .docx (Word文档)
    """
    
    # 验证文件类型
    if not file.filename.endswith('.docx'):
        raise HTTPException(
            status_code=400, 
            detail="仅支持 .docx 格式的文件"
        )
    
    try:
        # 创建临时文件保存上传的文件
        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # 解析简历内容
        resume_data = resume_parser.parse_resume(temp_file_path)
        
        # 保存解析结果到CSV
        save_success = data_storage.save_resume_data(resume_data)
        
        # 清理临时文件
        os.unlink(temp_file_path)
        
        if save_success:
            return UploadResponse(
                success=True,
                message="简历上传和解析成功",
                data=resume_data
            )
        else:
            return UploadResponse(
                success=False,
                message="简历解析成功，但保存到数据库失败",
                data=resume_data
            )
            
    except Exception as e:
        # 清理临时文件
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        
        raise HTTPException(
            status_code=500,
            detail=f"处理文件时出错: {str(e)}"
        )


@app.get("/resumes")
async def get_resumes(
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    limit: int = Query(100, description="返回结果数量限制")
):
    """
    获取简历列表
    
    参数：
    - keyword: 可选的搜索关键词
    - limit: 返回结果数量限制
    """
    try:
        if keyword:
            resumes = data_storage.search_resumes(keyword)
        else:
            resumes = data_storage.get_all_resumes()
        
        # 限制返回数量
        if limit > 0:
            resumes = resumes[:limit]
        
        return {
            "success": True,
            "count": len(resumes),
            "data": resumes
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取简历数据时出错: {str(e)}"
        )


@app.get("/stats")
async def get_stats():
    """获取系统统计信息"""
    try:
        total_count = data_storage.get_resume_count()
        
        return {
            "success": True,
            "data": {
                "total_resumes": total_count,
                "system_status": "运行正常"
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"获取统计信息时出错: {str(e)}"
        )


@app.post("/submit-form")
async def submit_resume_form(form_data: ResumeFormData):
    """
    提交简历表单数据
    
    接收前端表单提交的简历数据，直接保存到CSV文件
    """
    try:
        # 将表单数据转换为ResumeData格式
        resume_data = ResumeData(
            姓名=form_data.姓名 or "",
            性别=form_data.性别 or "",
            年龄=form_data.年龄 or "",
            政治面貌=form_data.政治面貌 or "",
            体重=form_data.体重 or "",
            籍贯=form_data.籍贯 or "",
            健康状况=form_data.健康状况 or "",
            身高=form_data.身高 or "",
            学历=form_data.学历 or "",
            毕业院校=form_data.毕业院校 or "",
            专业=form_data.专业 or "",
            求职意向=form_data.求职意向 or "",
            手机=form_data.手机 or "",
            邮箱=form_data.邮箱 or "",
            教育经历=form_data.教育经历 or "",
            荣誉奖项=form_data.荣誉奖项 or "",
            技能证书=form_data.技能证书 or "",
            工作经历=form_data.工作经历 or "",
            兴趣爱好=form_data.兴趣爱好 or "",
            自我评价=form_data.自我评价 or ""
        )
        
        # 保存到CSV文件
        save_success = data_storage.save_resume_data(resume_data)
        
        if save_success:
            return {
                "success": True,
                "message": "简历表单提交成功",
                "data": resume_data.dict()
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="保存简历数据失败"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"提交简历表单时出错: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "message": "服务运行正常"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 