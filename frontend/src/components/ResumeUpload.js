import React, { useState } from 'react';
import {
  Upload,
  Button,
  Card,
  message,
  Progress,
  Descriptions,
  Alert,
  Space,
  Typography,
  Divider
} from 'antd';
import { UploadOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { uploadResume } from '../services/api';

const { Title, Text } = Typography;

const ResumeUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseResult, setParseResult] = useState(null);
  const [fileList, setFileList] = useState([]);

  // 处理文件上传
  const handleUpload = async (file) => {
    // 验证文件类型
    const allowedExtensions = ['.docx', '.pdf'];
    const isValidType = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      message.error('仅支持 .docx 和 .pdf 格式的文件');
      return false;
    }

    // 验证文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      message.error('文件大小不能超过 10MB');
      return false;
    }

    setUploading(true);
    setUploadProgress(0);
    setParseResult(null);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 上传文件
      const result = await uploadResume(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        message.success('简历上传和解析成功！');
        setParseResult(result.data);
        
        // 通知父组件上传成功
        if (onUploadSuccess) {
          onUploadSuccess(result.data);
        }
      } else {
        message.warning(result.message || '解析成功但保存失败');
        setParseResult(result.data);
      }

    } catch (error) {
      console.error('上传失败:', error);
      message.error(error.response?.data?.detail || '上传失败，请重试');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }

    return false; // 阻止默认上传行为
  };

  // 自定义上传属性
  const uploadProps = {
    beforeUpload: handleUpload,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    maxCount: 1,
    accept: '.docx,.pdf',
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: !uploading,
    },
  };

  // 渲染解析结果
  const renderParseResult = () => {
    if (!parseResult) return null;

    const basicInfo = [
      { label: '姓名', value: parseResult.姓名 },
      { label: '性别', value: parseResult.性别 },
      { label: '年龄', value: parseResult.年龄 },
      { label: '身高', value: parseResult.身高 },
      { label: '体重', value: parseResult.体重 },
      { label: '籍贯', value: parseResult.籍贯 },
      { label: '政治面貌', value: parseResult.政治面貌 },
      { label: '健康状况', value: parseResult.健康状况 },
    ];

    const contactInfo = [
      { label: '手机', value: parseResult.手机 },
      { label: '邮箱', value: parseResult.邮箱 },
    ];

    const educationInfo = [
      { label: '学历', value: parseResult.学历 },
      { label: '毕业院校', value: parseResult.毕业院校 },
      { label: '专业', value: parseResult.专业 },
      { label: '求职意向', value: parseResult.求职意向 },
    ];

    const detailedInfo = [
      { label: '教育经历', value: parseResult.教育经历 },
      { label: '工作经历', value: parseResult.工作经历 },
      { label: '荣誉奖项', value: parseResult.荣誉奖项 },
      { label: '技能证书', value: parseResult.技能证书 },
      { label: '兴趣爱好', value: parseResult.兴趣爱好 },
      { label: '自我评价', value: parseResult.自我评价 },
    ];

    return (
      <Card 
        title={
          <Space>
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
            <span>解析结果</span>
          </Space>
        }
        style={{ marginTop: 24 }}
      >
        <Alert
          message="解析完成"
          description="系统已成功解析简历内容并保存到数据库中"
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Title level={5}>基本信息</Title>
        <Descriptions bordered size="small" column={2}>
          {basicInfo.map(item => (
            <Descriptions.Item 
              key={item.label} 
              label={item.label}
              span={item.value && item.value.length > 20 ? 2 : 1}
            >
              {item.value || <Text type="secondary">未识别</Text>}
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Divider />

        <Title level={5}>联系方式</Title>
        <Descriptions bordered size="small" column={2}>
          {contactInfo.map(item => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value || <Text type="secondary">未识别</Text>}
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Divider />

        <Title level={5}>教育职业信息</Title>
        <Descriptions bordered size="small" column={2}>
          {educationInfo.map(item => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value || <Text type="secondary">未识别</Text>}
            </Descriptions.Item>
          ))}
        </Descriptions>

        <Divider />

        <Title level={5}>详细信息</Title>
        <Descriptions bordered size="small" column={1}>
          {detailedInfo.map(item => (
            <Descriptions.Item key={item.label} label={item.label}>
              {item.value ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>{item.value}</div>
              ) : (
                <Text type="secondary">未识别</Text>
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Card>
    );
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <FileTextOutlined />
            <span>简历上传</span>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Upload.Dragger {...uploadProps} style={{ marginBottom: 16 }}>
            <div style={{ padding: '20px 0' }}>
              <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              <div style={{ marginTop: 16 }}>
                <Text strong>点击或拖拽文件到此区域上传</Text>
              </div>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">支持 .docx 和 .pdf 格式的简历文件，单个文件大小不超过 10MB</Text>
              </div>
            </div>
          </Upload.Dragger>

          {uploading && (
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={uploadProgress} 
                status={uploadProgress === 100 ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  {uploadProgress < 90 ? '正在上传...' : '正在解析简历内容...'}
                </Text>
              </div>
            </div>
          )}

          {!uploading && fileList.length === 0 && (
            <Button 
              type="primary" 
              icon={<UploadOutlined />}
              onClick={() => document.querySelector('.ant-upload input').click()}
            >
              选择文件
            </Button>
          )}
        </div>
      </Card>

      {renderParseResult()}
    </div>
  );
};

export default ResumeUpload; 