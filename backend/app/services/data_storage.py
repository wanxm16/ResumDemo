import os
import pandas as pd
import csv
from datetime import datetime
from typing import List
from ..models import ResumeData


class DataStorage:
    """数据存储服务"""
    
    def __init__(self, csv_path: str = "../data/resume.csv"):
        self.csv_path = csv_path
        self._ensure_csv_exists()
    
    def _ensure_csv_exists(self):
        """确保CSV文件和目录存在"""
        # 确保data目录存在
        os.makedirs(os.path.dirname(self.csv_path), exist_ok=True)
        
        # 如果CSV文件不存在，创建空文件
        if not os.path.exists(self.csv_path):
            # 定义CSV的列名
            columns = [
                '姓名', '性别', '年龄', '政治面貌', '体重', '籍贯', '健康状况', '身高', 
                '学历', '毕业院校', '专业', '求职意向', '手机', '邮箱', '教育经历', 
                '荣誉奖项', '技能证书', '工作经历', '兴趣爱好', '自我评价', '录入时间'
            ]
            empty_df = pd.DataFrame(columns=columns)
            empty_df.to_csv(self.csv_path, index=False, encoding='utf-8')
    
    def _recreate_csv(self):
        """重新创建CSV文件"""
        try:
            # 删除损坏的文件
            if os.path.exists(self.csv_path):
                os.remove(self.csv_path)
            # 重新创建
            self._ensure_csv_exists()
        except Exception as e:
            print(f"重新创建CSV文件时出错: {str(e)}")
    
    def save_resume_data(self, resume_data: ResumeData) -> bool:
        """保存简历数据到CSV文件"""
        try:
            # 将简历数据转换为字典
            data_dict = resume_data.dict()
            
            # 清理数据中的换行符，避免CSV格式问题
            for key, value in data_dict.items():
                if isinstance(value, str):
                    # 彻底清理换行符和特殊字符，避免CSV解析错误
                    cleaned_value = value.replace('\n', ' ').replace('\r', ' ')
                    # 对于JSON字段，不转义双引号
                    if key not in ['教育经历', '工作经历']:
                        cleaned_value = cleaned_value.replace('"', '""')  # 转义双引号
                    cleaned_value = ' '.join(cleaned_value.split())  # 合并多个空格
                    data_dict[key] = cleaned_value
            
            # 添加录入时间
            data_dict['录入时间'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # 尝试读取现有数据，如果失败则创建新文件
            try:
                existing_df = pd.read_csv(self.csv_path, encoding='utf-8')
            except:
                # 如果文件不存在或损坏，重新创建
                print("CSV文件不存在或损坏，创建新文件")
                self._ensure_csv_exists()
                existing_df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 创建新的数据行
            new_row = pd.DataFrame([data_dict])
            
            # 将新数据追加到现有数据
            updated_df = pd.concat([existing_df, new_row], ignore_index=True)
            
            # 使用csv模块保存，确保格式正确
            with open(self.csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=updated_df.columns)
                writer.writeheader()
                for _, row in updated_df.iterrows():
                    writer.writerow(row.to_dict())
            
            return True
            
        except Exception as e:
            print(f"保存数据时出错: {str(e)}")
            # 尝试重新创建CSV文件
            try:
                self._recreate_csv()
                # 重新尝试保存
                data_dict = resume_data.dict()
                for key, value in data_dict.items():
                    if isinstance(value, str):
                        cleaned_value = value.replace('\n', ' ').replace('\r', ' ')
                        # 对于JSON字段，不转义双引号
                        if key not in ['教育经历', '工作经历']:
                            cleaned_value = cleaned_value.replace('"', '""')
                        cleaned_value = ' '.join(cleaned_value.split())
                        data_dict[key] = cleaned_value
                data_dict['录入时间'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                # 使用csv模块直接写入
                columns = [
                    '姓名', '性别', '年龄', '政治面貌', '体重', '籍贯', '健康状况', '身高', 
                    '学历', '毕业院校', '专业', '求职意向', '手机', '邮箱', '教育经历', 
                    '荣誉奖项', '技能证书', '工作经历', '兴趣爱好', '自我评价', '录入时间'
                ]
                with open(self.csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                    writer = csv.DictWriter(csvfile, fieldnames=columns)
                    writer.writeheader()
                    writer.writerow(data_dict)
                return True
            except Exception as e2:
                print(f"重新创建和保存失败: {str(e2)}")
                return False
    
    def get_all_resumes(self) -> List[dict]:
        """获取所有简历数据"""
        try:
            # 简化CSV读取参数
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 将NaN值替换为None
            df = df.fillna('')  # 先用空字符串填充NaN
            
            # 转换为字典格式
            records = df.to_dict('records')
            
            # 将空字符串转换为None
            for record in records:
                for key, value in record.items():
                    if value == '':
                        record[key] = None
            
            return records
            
        except Exception as e:
            print(f"读取数据时出错: {str(e)}")
            # 如果CSV损坏，重新创建空文件
            self._recreate_csv()
            return []
    
    def get_resume_count(self) -> int:
        """获取简历总数"""
        try:
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            return len(df)
        except:
            return 0
    
    def search_resumes(self, keyword: str) -> List[dict]:
        """根据关键词搜索简历"""
        try:
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 在所有文本列中搜索关键词
            text_columns = ['姓名', '专业', '毕业院校', '求职意向', '工作经历', '技能证书']
            
            mask = pd.Series([False] * len(df))
            for col in text_columns:
                if col in df.columns:
                    mask |= df[col].astype(str).str.contains(keyword, case=False, na=False)
            
            filtered_df = df[mask]
            
            # 将NaN值替换为None
            filtered_df = filtered_df.where(pd.notnull(filtered_df), None)
            
            return filtered_df.to_dict('records')
            
        except Exception as e:
            print(f"搜索数据时出错: {str(e)}")
            return [] 