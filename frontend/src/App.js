import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Tabs,
  Card,
  Statistic,
  Row,
  Col,
  message,
  Space,
  Divider
} from 'antd';
import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FormOutlined
} from '@ant-design/icons';
import ResumeUpload from './components/ResumeUpload';
import ResumeList from './components/ResumeList';
import ResumeForm from './components/ResumeForm';
import { getStats } from './services/api';
import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState({ total_resumes: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 加载统计信息
  const loadStats = async () => {
    try {
      const response = await getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('加载统计信息失败:', error);
    }
  };

  // 组件挂载时加载统计信息
  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  // 处理上传成功
  const handleUploadSuccess = (data) => {
    message.success('简历上传成功！');
    // 刷新统计信息和列表
    setRefreshTrigger(prev => prev + 1);
    // 自动切换到列表页面
    setTimeout(() => {
      setActiveTab('list');
    }, 1000);
  };

  // 处理表单提交成功
  const handleFormSuccess = () => {
    message.success('简历提交成功！');
    // 刷新统计信息和列表
    setRefreshTrigger(prev => prev + 1);
    // 自动切换到列表页面
    setTimeout(() => {
      setActiveTab('list');
    }, 1000);
  };

  // Tab项配置
  const tabItems = [
    {
      key: 'upload',
      label: (
        <Space>
          <CloudUploadOutlined />
          <span>简历上传</span>
        </Space>
      ),
      children: <ResumeUpload onUploadSuccess={handleUploadSuccess} />
    },
    {
      key: 'form',
      label: (
        <Space>
          <FormOutlined />
          <span>填写简历</span>
        </Space>
      ),
      children: <ResumeForm onSuccess={handleFormSuccess} />
    },
    {
      key: 'list',
      label: (
        <Space>
          <UnorderedListOutlined />
          <span>简历列表</span>
        </Space>
      ),
      children: <ResumeList refreshTrigger={refreshTrigger} />
    },
    {
      key: 'stats',
      label: (
        <Space>
          <BarChartOutlined />
          <span>统计信息</span>
        </Space>
      ),
      children: (
        <Card title="系统统计">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title="总简历数量"
                value={stats.total_resumes}
                prefix={<FileTextOutlined />}
                suffix="份"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="系统状态"
                value={stats.system_status || '正常'}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="在线时长"
                value="24/7"
                suffix="服务"
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
          </Row>
        </Card>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header style={{ 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0 24px',
        borderBottom: '1px solid #e8e8e8'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <FileTextOutlined style={{ 
            fontSize: '24px', 
            color: '#1890ff', 
            marginRight: '12px' 
          }} />
          <Title level={3} style={{ 
            margin: 0, 
            color: '#1890ff',
            fontWeight: 'bold'
          }}>
            简历上传解析系统
          </Title>
          <div style={{ marginLeft: 'auto' }}>
            <Text type="secondary">
              智能简历解析 · 数据结构化存储
            </Text>
          </div>
        </div>
      </Header>

      <Content style={{ 
        padding: '24px',
        margin: 0,
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            size="large"
            style={{ padding: '0 24px' }}
            items={tabItems}
          />
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        backgroundColor: '#fff',
        borderTop: '1px solid #e8e8e8',
        padding: '24px 50px'
      }}>
        <Space direction="vertical" size="small">
          <Text strong>简历上传解析系统</Text>
          <Text type="secondary">
            基于 FastAPI + React + Ant Design 构建 | 
            支持 Word 格式简历智能解析 | 
            数据安全可靠
          </Text>
          <Divider type="vertical" />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 Resume Upload System. 技术栈：Python FastAPI + React + Ant Design
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App; 