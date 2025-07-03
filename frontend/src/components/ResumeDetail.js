import React from 'react';
import {
  Typography,
  Button,
  Space,
  message
} from 'antd';
import {
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const { Text } = Typography;

const ResumeDetail = ({ resume, onClose }) => {
  // 解析JSON格式的教育经历
  const parseEducationHistory = (educationStr) => {
    if (!educationStr) return null;
    try {
      const fixedStr = educationStr.replace(/""/g, '"');
      return JSON.parse(fixedStr);
    } catch (error) {
      console.error('教育经历解析失败:', error);
      return null;
    }
  };

  // 解析JSON格式的工作经历
  const parseWorkHistory = (workStr) => {
    if (!workStr) return null;
    try {
      const fixedStr = workStr.replace(/""/g, '"');
      return JSON.parse(fixedStr);
    } catch (error) {
      console.error('工作经历解析失败:', error);
      return null;
    }
  };

  // 格式化教育经历文本
  const formatEducationHistory = (educationHistory) => {
    if (!educationHistory || educationHistory.length === 0) {
      return resume.教育经历 || '暂无教育经历信息';
    }
    
    return educationHistory.map(edu => {
      const parts = [];
      if (edu.start_time && edu.end_time) {
        parts.push(`起止时间：${edu.start_time} – ${edu.end_time}`);
      }
      if (edu.school) {
        parts.push(`学校：${edu.school}`);
      }
      if (edu.degree) {
        parts.push(`学历：${edu.degree}`);
      }
      if (edu.major) {
        parts.push(`专业：${edu.major}`);
      }
      return parts.join('\n');
    }).join('\n\n');
  };

  // 格式化工作经历文本
  const formatWorkHistory = (workHistory) => {
    if (!workHistory || workHistory.length === 0) {
      return resume.工作经历 || '暂无工作经历信息';
    }
    
    return workHistory.map(work => {
      const parts = [];
      if (work.start_time && work.end_time) {
        parts.push(`起止时间：${work.start_time} – ${work.end_time}`);
      }
      if (work.company) {
        parts.push(`公司：${work.company}`);
      }
      if (work.position) {
        parts.push(`职位：${work.position}`);
      }
      if (work.responsibilities) {
        parts.push(`主要职责：${work.responsibilities}`);
      }
      return parts.join('\n');
    }).join('\n\n');
  };

  // 导出PDF功能
  const exportToPDF = async () => {
    try {
      message.loading({ content: '正在生成PDF...', key: 'pdf-export' });
      
      const element = document.getElementById('resume-detail-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resume.姓名 || '简历'}_简历.pdf`);
      message.success({ content: 'PDF导出成功！', key: 'pdf-export' });
    } catch (error) {
      console.error('PDF导出失败:', error);
      message.error({ content: 'PDF导出失败，请重试', key: 'pdf-export' });
    }
  };

  // 打印功能
  const handlePrint = () => {
    window.print();
  };

  const educationHistory = parseEducationHistory(resume.教育经历);
  const workHistory = parseWorkHistory(resume.工作经历);
  const formattedEducation = formatEducationHistory(educationHistory);
  const formattedWork = formatWorkHistory(workHistory);

  // 通用单元格样式
  const cellStyle = {
    border: '1px solid #000',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40px'
  };

  const labelStyle = {
    ...cellStyle,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5'
  };

  const contentStyle = {
    ...cellStyle,
    backgroundColor: '#fff'
  };

  const multilineStyle = {
    ...cellStyle,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    whiteSpace: 'pre-line',
    lineHeight: '1.6',
    textAlign: 'left',
    minHeight: '60px'
  };

  return (
    <div>
      {/* 操作按钮 */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Space>
          <Button type="primary" icon={<DownloadOutlined />} onClick={exportToPDF}>
            导出PDF
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            打印
          </Button>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      </div>

      {/* 简历内容 - CSS Grid布局 */}
      <div 
        id="resume-detail-content" 
        style={{ 
          backgroundColor: '#fff', 
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          border: '2px solid #000',
          fontFamily: '宋体, SimSun, "Microsoft YaHei", sans-serif',
          fontSize: '14px',
          width: '100%'
        }}>
          
          {/* 第一行：姓名、性别、年龄 */}
          <div style={labelStyle}>姓名</div>
          <div style={contentStyle}>{resume.姓名 || ''}</div>
          <div style={labelStyle}>性别</div>
          <div style={contentStyle}>{resume.性别 || ''}</div>
          <div style={labelStyle}>年龄</div>
          <div style={contentStyle}>{resume.年龄 || ''}</div>

          {/* 第二行：政治面貌、体重、籍贯 */}
          <div style={labelStyle}>政治面貌</div>
          <div style={contentStyle}>{resume.政治面貌 || ''}</div>
          <div style={labelStyle}>体重</div>
          <div style={contentStyle}>{resume.体重 ? `${resume.体重}kg` : ''}</div>
          <div style={labelStyle}>籍贯</div>
          <div style={contentStyle}>{resume.籍贯 || ''}</div>

          {/* 第三行：健康状况、身高、学历 */}
          <div style={labelStyle}>健康状况</div>
          <div style={contentStyle}>{resume.健康状况 || ''}</div>
          <div style={labelStyle}>身高</div>
          <div style={contentStyle}>{resume.身高 ? `${resume.身高}cm` : ''}</div>
          <div style={labelStyle}>学历</div>
          <div style={contentStyle}>{resume.学历 || ''}</div>

          {/* 第四行：毕业院校、专业 */}
          <div style={labelStyle}>毕业院校</div>
          <div style={contentStyle}>{resume.毕业院校 || ''}</div>
          <div style={labelStyle}>专业</div>
          <div style={{...contentStyle, gridColumn: 'span 3'}}>{resume.专业 || ''}</div>

          {/* 第五行：求职意向 */}
          <div style={labelStyle}>求职意向</div>
          <div style={{...contentStyle, gridColumn: 'span 5'}}>{resume.求职意向 || ''}</div>

          {/* 第六行：手机、邮箱 */}
          <div style={labelStyle}>手机</div>
          <div style={{...contentStyle, gridColumn: 'span 2'}}>{resume.手机 || ''}</div>
          <div style={labelStyle}>邮箱</div>
          <div style={{...contentStyle, gridColumn: 'span 2'}}>{resume.邮箱 || ''}</div>

          {/* 教育经历 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>教育经历</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{formattedEducation}</div>

          {/* 荣誉奖项 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>荣誉奖项</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{resume.荣誉奖项 || ''}</div>

          {/* 技能证书 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>技能证书</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{resume.技能证书 || ''}</div>

          {/* 工作经历 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>工作经历</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{formattedWork}</div>

          {/* 兴趣爱好 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>兴趣爱好</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{resume.兴趣爱好 || ''}</div>

          {/* 自我评价 */}
          <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>自我评价</div>
          <div style={{...multilineStyle, gridColumn: 'span 5'}}>{resume.自我评价 || ''}</div>

        </div>
      </div>

      {/* 打印样式 */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-detail-content, #resume-detail-content * {
              visibility: visible;
            }
            #resume-detail-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              box-shadow: none !important;
            }
            table {
              page-break-inside: avoid;
            }
            tr {
              page-break-inside: avoid;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumeDetail; 