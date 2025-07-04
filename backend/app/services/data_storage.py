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
            
            # 按录入时间倒序排列（最新的在前面）
            if '录入时间' in df.columns:
                df = df.sort_values('录入时间', ascending=False)
            
            # 将NaN值替换为None
            df = df.fillna('')  # 先用空字符串填充NaN
            
            # 转换为字典格式
            records = df.to_dict('records')
            
            # 将空字符串转换为None，确保没有NaN值
            for record in records:
                for key, value in record.items():
                    if value == '' or pd.isna(value):
                        record[key] = None
                    # 确保数值类型不包含NaN
                    elif isinstance(value, float) and pd.isna(value):
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
    
    def delete_resume(self, index: int) -> bool:
        """删除指定索引的简历记录"""
        try:
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 检查索引是否有效
            if index < 0 or index >= len(df):
                print(f"无效的索引: {index}")
                return False
            
            # 删除指定行
            df = df.drop(index=index).reset_index(drop=True)
            
            # 保存更新后的数据
            df.to_csv(self.csv_path, index=False, encoding='utf-8')
            
            return True
            
        except Exception as e:
            print(f"删除数据时出错: {str(e)}")
            return False
    
    def delete_resume_by_id(self, unique_id: str) -> bool:
        """根据唯一标识符删除简历记录（姓名_录入时间）"""
        try:
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 解析唯一标识符
            parts = unique_id.split('_', 1)  # 分割成最多2部分，以防姓名中有下划线
            if len(parts) != 2:
                print(f"无效的唯一标识符格式: {unique_id}")
                return False
                
            name, record_time = parts
            
            # 查找匹配的记录
            mask = (df['姓名'] == name) & (df['录入时间'] == record_time)
            matching_rows = df[mask]
            
            if len(matching_rows) == 0:
                print(f"未找到匹配的记录: {unique_id}")
                return False
            
            if len(matching_rows) > 1:
                print(f"找到多条匹配记录，删除第一条: {unique_id}")
            
            # 删除匹配的行（如果有多条，删除第一条）
            first_match_index = matching_rows.index[0]
            df = df.drop(index=first_match_index).reset_index(drop=True)
            
            # 保存更新后的数据
            df.to_csv(self.csv_path, index=False, encoding='utf-8')
            
            print(f"成功删除记录: {unique_id}")
            return True
            
        except Exception as e:
            print(f"根据ID删除数据时出错: {str(e)}")
            return False
    
    def filter_resumes(self, keyword: str = '', min_age: int = None, max_age: int = None, 
                      min_work_years: int = None, max_work_years: int = None,
                      gender: str = None, political_status: str = None) -> List[dict]:
        """根据多个条件筛选简历"""
        try:
            df = pd.read_csv(self.csv_path, encoding='utf-8')
            
            # 关键词搜索
            if keyword:
                text_columns = ['姓名', '专业', '毕业院校', '求职意向', '工作经历', '技能证书']
                mask = pd.Series([False] * len(df))
                for col in text_columns:
                    if col in df.columns:
                        mask |= df[col].astype(str).str.contains(keyword, case=False, na=False)
                df = df[mask]
            
            # 年龄筛选
            if min_age is not None or max_age is not None:
                df['年龄_数值'] = pd.to_numeric(df['年龄'], errors='coerce')
                # 过滤掉NaN值
                df = df[df['年龄_数值'].notna()]
                if min_age is not None:
                    df = df[df['年龄_数值'] >= min_age]
                if max_age is not None:
                    df = df[df['年龄_数值'] <= max_age]
                df = df.drop('年龄_数值', axis=1)
            
            # 性别筛选
            if gender is not None and gender != '':
                df = df[df['性别'].astype(str).str.contains(gender, case=False, na=False)]
            
            # 政治面貌筛选
            if political_status is not None and political_status != '':
                df = df[df['政治面貌'].astype(str).str.contains(political_status, case=False, na=False)]
            
            # 工作年限筛选
            if min_work_years is not None or max_work_years is not None:
                work_years_list = []
                for idx, row in df.iterrows():
                    work_years = self._calculate_work_years(row.get('工作经历', ''), row.get('年龄', ''))
                    work_years_list.append(work_years)
                
                df['工作年限'] = work_years_list
                
                if min_work_years is not None:
                    df = df[df['工作年限'] >= min_work_years]
                if max_work_years is not None:
                    df = df[df['工作年限'] <= max_work_years]
                
                # 移除临时列
                df = df.drop('工作年限', axis=1)
            
            # 按录入时间倒序排列（最新的在前面）
            if '录入时间' in df.columns:
                df = df.sort_values('录入时间', ascending=False)
            
            # 将NaN值替换为None，确保不包含NaN值
            df = df.fillna('')  # 先用空字符串填充NaN
            
            # 转换为字典格式
            records = df.to_dict('records')
            
            # 将空字符串转换为None，确保没有NaN值
            for record in records:
                for key, value in record.items():
                    if value == '' or pd.isna(value):
                        record[key] = None
                    # 确保数值类型不包含NaN
                    elif isinstance(value, float) and pd.isna(value):
                        record[key] = None
            
            return records
            
        except Exception as e:
            print(f"筛选数据时出错: {str(e)}")
            return []
    
    def _calculate_work_years(self, work_experience: str, age: str) -> int:
        """计算工作年限"""
        try:
            import json
            import re
            from datetime import datetime
            
            # 如果没有工作经历，返回0
            if not work_experience or work_experience == '':
                return 0
            
            # 尝试解析JSON格式的工作经历
            try:
                work_list = json.loads(work_experience)
                if not isinstance(work_list, list) or len(work_list) == 0:
                    return 0
                
                total_months = 0
                current_year = datetime.now().year
                
                for work in work_list:
                    start_time = work.get('start_time', '')
                    end_time = work.get('end_time', '')
                    
                    # 解析开始时间
                    start_match = re.search(r'(\d{4})-(\d{1,2})', start_time)
                    if not start_match:
                        continue
                    
                    start_year = int(start_match.group(1))
                    start_month = int(start_match.group(2))
                    
                    # 解析结束时间
                    if '至今' in end_time or end_time == '':
                        end_year = current_year
                        end_month = datetime.now().month
                    else:
                        end_match = re.search(r'(\d{4})-(\d{1,2})', end_time)
                        if not end_match:
                            # 如果没有找到格式化时间，假设到当前时间
                            end_year = current_year
                            end_month = datetime.now().month
                        else:
                            end_year = int(end_match.group(1))
                            end_month = int(end_match.group(2))
                    
                    # 计算月份差
                    months = (end_year - start_year) * 12 + (end_month - start_month)
                    total_months += max(0, months)
                
                # 转换为年份（向下取整）
                work_years = total_months // 12
                return max(0, work_years)
                
            except (json.JSONDecodeError, KeyError, TypeError):
                # 如果JSON解析失败，尝试简单估算
                # 根据年龄估算：假设22岁开始工作
                try:
                    age_num = int(age) if age and age.isdigit() else 22
                    estimated_work_years = max(0, age_num - 22)
                    return min(estimated_work_years, 15)  # 最多15年工作经验
                except:
                    return 0
        
        except Exception as e:
            print(f"计算工作年限时出错: {str(e)}")
            return 0 