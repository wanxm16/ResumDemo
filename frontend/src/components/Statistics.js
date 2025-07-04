import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Space,
  Spin,
  Empty
} from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  BookOutlined,
  BankOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { getStats } from '../services/api';

const { Text } = Typography;

// 图表配色方案
const COLORS = ['#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fadb14'];
const GENDER_COLORS = { '男': '#1890ff', '女': '#eb2f96' };

const Statistics = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  // 加载统计数据
  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('加载统计信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);



  // 计算平均年龄
  const calculateAverageAge = () => {
    if (!stats.age_distribution) return '-';
    
    let totalAge = 0;
    let totalCount = 0;
    
    Object.entries(stats.age_distribution).forEach(([ageRange, count]) => {
      let midAge;
      if (ageRange === '46+') {
        midAge = 50; // 假设46+的平均年龄为50
      } else {
        const [min, max] = ageRange.split('-').map(Number);
        midAge = (min + max) / 2;
      }
      totalAge += midAge * count;
      totalCount += count;
    });
    
    return totalCount > 0 ? Math.round(totalAge / totalCount) : '-';
  };

  // 自定义饼图标签
  const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null; // 小于5%不显示标签
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${label || payload[0].payload.name}`}</p>
          <p style={{ margin: 0, color: payload[0].color }}>
            {`人数: ${payload[0].value}人`}
          </p>
        </div>
      );
    }
    return null;
  };



  // 渲染TOP榜单表格
  const renderTopTable = (data, title, keyLabel, valueLabel) => {
    if (!data || Object.keys(data).length === 0) {
      return <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    const tableData = Object.entries(data).map(([key, value], index) => ({
      key: index,
      rank: index + 1,
      name: key,
      count: value
    }));

    const columns = [
      {
        title: '排名',
        dataIndex: 'rank',
        width: 60,
        render: (rank) => {
          let color = '#666';
          if (rank === 1) color = '#FFD700';
          else if (rank === 2) color = '#C0C0C0';
          else if (rank === 3) color = '#CD7F32';
          return <Text style={{ color, fontWeight: 'bold' }}>{rank}</Text>;
        }
      },
      {
        title: keyLabel,
        dataIndex: 'name',
        ellipsis: true
      },
      {
        title: valueLabel,
        dataIndex: 'count',
        width: 80,
        render: (count) => <Text strong>{count}</Text>
      }
    ];

    return (
      <Table
        dataSource={tableData}
        columns={columns}
        pagination={false}
        size="small"
        style={{ maxHeight: 300, overflow: 'auto' }}
      />
    );
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>正在加载统计数据...</Text>
          </div>
        </div>
      </Card>
    );
  }

  const { total_resumes = 0 } = stats;

  // 准备图表数据 - 修复数据格式
  const genderData = Object.entries(stats.gender_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const ageData = Object.entries(stats.age_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const educationData = Object.entries(stats.education_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const workYearsData = Object.entries(stats.work_years_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));

  const timeData = Object.entries(stats.time_distribution || {}).map(([key, value]) => ({
    name: key,
    value: value
  }));
  
  // TOP专业数据（取前8个）- 修复数据格式
  const topMajorsData = Object.entries(stats.top_majors || {})
    .slice(0, 8)
    .map(([name, count]) => ({ name, value: count }));

  return (
    <div>
      {/* 基础统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总简历数量"
              value={total_resumes}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              suffix="份"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统状态"
              value={stats.system_status || '运行正常'}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均年龄"
              value={calculateAverageAge()}
              prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
              suffix="岁"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线服务"
              value="24/7"
              prefix={<CalendarOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 分布统计 - 饼图和柱状图 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 性别分布 - 饼图 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <UserOutlined />
                <span>性别分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 250 }}>
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>

        {/* 学历分布 - 饼图 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                <span>学历分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 250 }}>
              {educationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={educationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {educationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>

        {/* 年龄分布 - 柱状图 */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>年龄分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 250 }}>
              {ageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 工作年限与录入时间分布 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 工作年限分布 - 面积图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>工作年限分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 250 }}>
              {workYearsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={workYearsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#722ed1" fill="#722ed1" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>

        {/* 录入时间分布 - 折线图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>录入时间分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 250 }}>
              {timeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#fa8c16" strokeWidth={3} dot={{ fill: '#fa8c16', strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 热门专业图表 + TOP榜单 */}
      <Row gutter={[16, 16]}>
        {/* 热门专业 - 使用普通柱状图（垂直） */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BookOutlined />
                <span>热门专业分布</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 300 }}>
              {topMajorsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topMajorsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      allowDecimals={false}
                      domain={[0, 'dataMax + 1']}
                    />
                    <Tooltip 
                      formatter={(value) => [value + '人', '人数']}
                      labelFormatter={(label) => `专业: ${label}`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#52c41a"
                      stroke="#52c41a"
                      strokeWidth={1}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="暂无数据" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
          </Card>
        </Col>

        {/* 热门院校TOP榜单 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BankOutlined />
                <span>热门院校 TOP10</span>
              </Space>
            }
            size="small"
          >
            <div style={{ height: 300, overflow: 'auto' }}>
              {renderTopTable(stats.top_schools, '热门院校', '院校名称', '人数')}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 求职意向榜单 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <TrophyOutlined />
                <span>热门求职意向 TOP10</span>
              </Space>
            }
            size="small"
          >
            {renderTopTable(stats.top_job_intentions, '热门求职意向', '职位名称', '人数')}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics; 