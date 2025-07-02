from pydantic import BaseModel
from typing import Optional


class ResumeData(BaseModel):
    """简历数据模型"""
    姓名: Optional[str] = None
    性别: Optional[str] = None
    年龄: Optional[str] = None
    政治面貌: Optional[str] = None
    体重: Optional[str] = None
    籍贯: Optional[str] = None
    健康状况: Optional[str] = None
    身高: Optional[str] = None
    学历: Optional[str] = None
    毕业院校: Optional[str] = None
    专业: Optional[str] = None
    求职意向: Optional[str] = None
    手机: Optional[str] = None
    邮箱: Optional[str] = None
    教育经历: Optional[str] = None
    荣誉奖项: Optional[str] = None
    技能证书: Optional[str] = None
    工作经历: Optional[str] = None
    兴趣爱好: Optional[str] = None
    自我评价: Optional[str] = None


class UploadResponse(BaseModel):
    """上传响应模型"""
    success: bool
    message: str
    data: Optional[ResumeData] = None 