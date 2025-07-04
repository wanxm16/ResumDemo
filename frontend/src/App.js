import React, { useState, useEffect } from 'react';
import {
  Layout,
  Typography,
  Tabs,
  message,
  Space,
  Divider,
  Dropdown
} from 'antd';
import {
  CloudUploadOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FormOutlined,
  HomeOutlined,
  DownOutlined,
  PlusOutlined
} from '@ant-design/icons';
import HomePage from './components/HomePage';
import ResumeUpload from './components/ResumeUpload';
import ResumeList from './components/ResumeList';
import ResumeForm from './components/ResumeForm';
import Statistics from './components/Statistics';
import { getStats } from './services/api';

import 'antd/dist/reset.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({});

  // 加载统计数据
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

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  // 处理上传成功
  const handleUploadSuccess = (data) => {
    message.success('简历上传成功！');
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setActiveTab('list');
    }, 1000);
  };

  // 处理表单提交成功
  const handleFormSuccess = () => {
    message.success('简历提交成功！');
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => {
      setActiveTab('list');
    }, 1000);
  };

  // 处理导航
  const handleNavigate = (tabKey) => {
    setActiveTab(tabKey);
  };

  // 简历录入下拉菜单
  const resumeInputMenu = {
    items: [
      {
        key: 'upload',
        label: (
          <Space>
            <CloudUploadOutlined />
            <span>上传文件</span>
          </Space>
        ),
        onClick: () => setActiveTab('upload')
      },
      {
        key: 'form',
        label: (
          <Space>
            <FormOutlined />
            <span>在线填写</span>
          </Space>
        ),
        onClick: () => setActiveTab('form')
      }
    ]
  };

  // 渲染内容
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} stats={stats} />;
      case 'upload':
        return (
          <div style={{ padding: '24px' }}>
            <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        );
      case 'form':
        return (
          <div style={{ padding: '24px' }}>
            <ResumeForm onSuccess={handleFormSuccess} />
          </div>
        );
      case 'list':
        return (
          <div style={{ padding: '24px' }}>
            <ResumeList refreshTrigger={refreshTrigger} />
          </div>
        );
      case 'stats':
        return (
          <div style={{ padding: '24px' }}>
            <Statistics refreshTrigger={refreshTrigger} />
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} stats={stats} />;
    }
  };

  // Tab项配置（仅用于显示标签栏）
  const tabItems = [
    {
      key: 'home',
      label: (
        <Space>
          <HomeOutlined />
          <span>首页</span>
        </Space>
      )
    },
    {
      key: 'resume-input',
      label: (
        <Dropdown menu={resumeInputMenu} trigger={['click']}>
          <Space>
            <PlusOutlined />
            <span>简历录入</span>
            <DownOutlined style={{ fontSize: '10px' }} />
          </Space>
        </Dropdown>
      )
    },
    {
      key: 'list',
      label: (
        <Space>
          <UnorderedListOutlined />
          <span>简历列表</span>
        </Space>
      )
    },
    {
      key: 'stats',
      label: (
        <Space>
          <BarChartOutlined />
          <span>统计分析</span>
        </Space>
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
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('home')}
          >
            智能简历管理系统
          </Title>
          <div style={{ marginLeft: 'auto' }}>
            <Text type="secondary">
              AI驱动 · 智能解析 · 高效管理
            </Text>
          </div>
        </div>
      </Header>

      <Content style={{ 
        padding: 0,
        margin: 0,
        backgroundColor: '#f0f2f5'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: activeTab === 'home' ? 'transparent' : '#fff',
          borderRadius: activeTab === 'home' ? '0' : '8px',
          boxShadow: activeTab === 'home' ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: activeTab === 'home' ? '0' : '24px',
          marginBottom: activeTab === 'home' ? '0' : '24px'
        }}>
          {/* 标签栏 */}
          {activeTab !== 'home' && (
            <Tabs
              activeKey={['upload', 'form'].includes(activeTab) ? 'resume-input' : activeTab}
              onChange={(key) => {
                if (key !== 'resume-input') {
                  setActiveTab(key);
                }
              }}
              size="large"
              style={{ padding: '0 24px' }}
              items={tabItems}
            />
          )}
          
          {/* 内容区域 */}
          {renderContent()}
        </div>
      </Content>

      <Footer style={{ 
        textAlign: 'center',
        backgroundColor: '#fff',
        borderTop: '1px solid #e8e8e8',
        padding: '24px 50px'
      }}>
        <Space direction="vertical" size="small">
          <Text strong>智能简历管理系统</Text>
          <Text type="secondary">
            基于 AI 技术的简历解析与管理平台 | 
            支持多格式文件智能解析 | 
            数据安全可靠 · 高效便捷
          </Text>
          <Divider type="vertical" />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            © 2024 AI Resume Management System. 技术栈：React + Ant Design + FastAPI + Python AI
          </Text>
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;
