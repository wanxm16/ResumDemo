import React from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Statistic,
  Timeline,
  Tag
} from 'antd';
import {
  CloudUploadOutlined,
  FormOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const HomePage = ({ onNavigate, stats = {} }) => {
  const features = [
    {
      icon: <CloudUploadOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '智能解析',
      description: '支持Word、PDF格式简历自动解析，提取关键信息'
    },
    {
      icon: <FormOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: '在线填写',
      description: '提供标准化表单，支持在线填写和编辑简历信息'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: '数据安全',
      description: '本地存储，数据安全可靠，支持导出备份'
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: '高效管理',
      description: '快速搜索、筛选、统计分析，提升HR工作效率'
    }
  ];

  const usageSteps = [
    {
      title: '上传简历文件',
      description: '支持Word、PDF格式，系统自动解析提取信息'
    },
    {
      title: '查看解析结果',
      description: '智能识别姓名、联系方式、教育经历、工作经验等'
    },
    {
      title: '管理简历库',
      description: '搜索、筛选、分类管理，支持批量操作'
    },
    {
      title: '数据统计分析',
      description: '可视化图表展示，深入了解人才结构'
    }
  ];

  return (
    <div style={{ padding: '0 24px 24px' }}>
      {/* 欢迎横幅 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        padding: '60px 40px',
        marginBottom: '32px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <FileTextOutlined style={{ fontSize: '64px', marginBottom: '24px' }} />
        <Title level={1} style={{ 
          color: '#fff', 
          margin: '0 0 16px 0',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          fontWeight: 'bold',
          fontSize: '48px'
        }}>
          智能简历管理系统
        </Title>
        <Paragraph style={{ 
          fontSize: '18px', 
          color: '#fff', 
          opacity: 1,
          margin: '0 0 32px 0',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          lineHeight: '1.6',
          fontWeight: '500'
        }}>
          基于AI技术的简历解析与管理平台，助力HR高效筛选人才，
          支持多格式文件解析、智能信息提取、可视化数据分析
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<CloudUploadOutlined />}
            onClick={() => onNavigate('upload')}
            style={{ 
              height: '48px',
              fontSize: '16px',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              color: '#fff',
              border: '2px solid #ff6b35',
              fontWeight: 'bold',
              boxShadow: '0 4px 16px rgba(255, 107, 53, 0.4)'
            }}
          >
            开始上传简历
          </Button>
          <Button 
            size="large" 
            icon={<FormOutlined />}
            onClick={() => onNavigate('form')}
            style={{ 
              height: '48px',
              fontSize: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)'
            }}
          >
            在线填写简历
          </Button>
        </Space>
      </div>

      {/* 数据统计卡片 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总简历数量"
              value={stats.total_resumes || 0}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              suffix="份"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="系统状态"
              value="运行正常"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="在线服务"
              value="24/7"
              prefix={<RocketOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 功能特色 */}
      <Card 
        title={
          <Space>
            <ThunderboltOutlined />
            <span>功能特色</span>
          </Space>
        }
        style={{ marginBottom: '32px' }}
      >
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div style={{ 
                textAlign: 'center', 
                padding: '24px 16px',
                borderRadius: '12px',
                background: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              >
                <div style={{ 
                  marginBottom: '16px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #f6f9ff 0%, #f0f5ff 100%)',
                  borderRadius: '50%',
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <Title level={4} style={{ margin: '0 0 12px 0', color: '#262626' }}>
                  {feature.title}
                </Title>
                <Text style={{ color: '#595959', lineHeight: '1.6' }}>
                  {feature.description}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 使用指南 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>使用指南</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Timeline>
              {usageSteps.map((step, index) => (
                <Timeline.Item 
                  key={index}
                  color={index === 0 ? '#1890ff' : '#d9d9d9'}
                >
                  <Title level={5} style={{ margin: '0 0 8px 0' }}>
                    {step.title}
                  </Title>
                  <Text type="secondary">
                    {step.description}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>

        {/* 快速导航 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>快速导航</span>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<CloudUploadOutlined />}
                onClick={() => onNavigate('upload')}
                block
                style={{ 
                  height: '64px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                }}
              >
                <div style={{ lineHeight: '1.2' }}>
                  <div>上传简历文件</div>
                  <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 'normal' }}>
                    支持Word、PDF格式自动解析
                  </div>
                </div>
              </Button>
              
              <Button 
                size="large" 
                icon={<FormOutlined />}
                onClick={() => onNavigate('form')}
                block
                style={{ 
                  height: '64px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)'
                }}
              >
                <div style={{ lineHeight: '1.2' }}>
                  <div>在线填写简历</div>
                  <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 'normal' }}>
                    标准化表单，信息完整准确
                  </div>
                </div>
              </Button>
              
              <Button 
                size="large" 
                icon={<UnorderedListOutlined />}
                onClick={() => onNavigate('list')}
                block
                style={{ 
                  height: '64px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #fa8c16 0%, #ffc53d 100%)',
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(250, 140, 22, 0.3)'
                }}
              >
                <div style={{ lineHeight: '1.2' }}>
                  <div>查看简历列表</div>
                  <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 'normal' }}>
                    搜索、筛选、管理简历数据
                  </div>
                </div>
              </Button>
              
              <Button 
                size="large" 
                icon={<BarChartOutlined />}
                onClick={() => onNavigate('stats')}
                block
                style={{ 
                  height: '64px', 
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #722ed1 0%, #b37feb 100%)',
                  border: 'none',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(114, 46, 209, 0.3)'
                }}
              >
                <div style={{ lineHeight: '1.2' }}>
                  <div>统计分析报告</div>
                  <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: 'normal' }}>
                    可视化图表，深度数据分析
                  </div>
                </div>
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 技术标签 */}
      <Card style={{ marginTop: '32px', textAlign: 'center' }}>
        <Title level={4} style={{ marginBottom: '16px' }}>技术栈</Title>
        <Space wrap>
          <Tag color="blue">React</Tag>
          <Tag color="green">Ant Design</Tag>
          <Tag color="orange">FastAPI</Tag>
          <Tag color="purple">Python</Tag>
          <Tag color="cyan">智能解析</Tag>
          <Tag color="gold">数据可视化</Tag>
          <Tag color="lime">响应式设计</Tag>
          <Tag color="magenta">现代化UI</Tag>
        </Space>
      </Card>
    </div>
  );
};

export default HomePage; 