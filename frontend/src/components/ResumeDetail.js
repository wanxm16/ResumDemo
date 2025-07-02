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
      // 修复双引号问题
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
      // 修复双引号问题
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

  // 获取格式化后的教育经历和工作经历文本
  const formattedEducation = formatEducationHistory(educationHistory);
  const formattedWork = formatWorkHistory(workHistory);

  return (
    <div>
      {/* 操作按钮 */}
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportToPDF}
          >
            导出PDF
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            打印
          </Button>
          <Button onClick={onClose}>关闭</Button>
        </Space>
      </div>

      {/* 简历内容 - 传统表格格式 */}
      <div 
        id="resume-detail-content" 
        style={{ 
          backgroundColor: '#fff', 
          padding: '20px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #000',
          fontFamily: '宋体, SimSun, "Microsoft YaHei", sans-serif',
          fontSize: '14px',
          tableLayout: 'fixed'
        }}>
          <tbody>
            {/* 第一行：姓名、性别、年龄 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.67%',
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                姓名
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.67%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.姓名 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.67%',
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                性别
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.67%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.性别 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.67%',
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                年龄
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                width: '16.65%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.年龄 || ''}
              </td>
            </tr>

            {/* 第二行：政治面貌、体重、籍贯 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                政治面貌
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.政治面貌 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                体重
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.体重 ? `${resume.体重}kg` : ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                籍贯
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.籍贯 || ''}
              </td>
            </tr>

            {/* 第三行：健康状况、身高、学历 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                健康状况
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.健康状况 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                身高
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.身高 ? `${resume.身高}cm` : ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                学历
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.学历 || ''}
              </td>
            </tr>

            {/* 第四行：毕业院校、专业 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                毕业院校
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center',
                verticalAlign: 'middle'
              }}>
                {resume.毕业院校 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                专业
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center', 
                colSpan: 3,
                verticalAlign: 'middle'
              }}>
                {resume.专业 || ''}
              </td>
            </tr>

            {/* 第五行：求职意向 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                求职意向
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center', 
                colSpan: 5,
                verticalAlign: 'middle'
              }}>
                {resume.求职意向 || ''}
              </td>
            </tr>

            {/* 第六行：手机、邮箱 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                手机
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center', 
                colSpan: 2,
                verticalAlign: 'middle'
              }}>
                {resume.手机 || ''}
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                邮箱
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                textAlign: 'center', 
                colSpan: 2,
                verticalAlign: 'middle'
              }}>
                {resume.邮箱 || ''}
              </td>
            </tr>

            {/* 教育经历 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'top',
                backgroundColor: '#f5f5f5',
                minHeight: '60px'
              }}>
                教育经历
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'top',
                whiteSpace: 'pre-line',
                textAlign: 'left',
                lineHeight: '1.6'
              }}>
                {formattedEducation}
              </td>
            </tr>

            {/* 荣誉奖项 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                荣誉奖项
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'middle',
                textAlign: 'left'
              }}>
                {resume.荣誉奖项 || ''}
              </td>
            </tr>

            {/* 技能证书 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                技能证书
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'middle',
                textAlign: 'left'
              }}>
                {resume.技能证书 || ''}
              </td>
            </tr>

            {/* 工作经历 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'top',
                backgroundColor: '#f5f5f5',
                minHeight: '80px'
              }}>
                工作经历
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'top',
                whiteSpace: 'pre-line',
                textAlign: 'left',
                lineHeight: '1.6'
              }}>
                {formattedWork}
              </td>
            </tr>

            {/* 兴趣爱好 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'middle',
                backgroundColor: '#f5f5f5'
              }}>
                兴趣爱好
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'middle',
                textAlign: 'left'
              }}>
                {resume.兴趣爱好 || ''}
              </td>
            </tr>

            {/* 自我评价 */}
            <tr>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                fontWeight: 'bold', 
                textAlign: 'center',
                verticalAlign: 'top',
                backgroundColor: '#f5f5f5'
              }}>
                自我评价
              </td>
              <td style={{ 
                border: '1px solid #000', 
                padding: '8px', 
                colSpan: 5,
                verticalAlign: 'top',
                textAlign: 'left',
                lineHeight: '1.4'
              }}>
                {resume.自我评价 || ''}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 录入时间 */}
        {resume.录入时间 && (
          <div style={{ textAlign: 'right', marginTop: 16, fontSize: '12px', color: '#666' }}>
            录入时间：{resume.录入时间}
          </div>
        )}
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