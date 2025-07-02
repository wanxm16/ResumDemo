import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Empty,
  Typography,
  Spin
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined
} from '@ant-design/icons';
import { getResumes } from '../services/api';
import ResumeDetail from './ResumeDetail';

const { Search } = Input;
const { Text } = Typography;

const ResumeList = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 加载简历列表
  const loadResumes = async (keyword = '') => {
    setLoading(true);
    try {
      const response = await getResumes(keyword);
      if (response.success) {
        setResumes(response.data);
        setFilteredResumes(response.data);
      } else {
        message.error('获取简历列表失败');
      }
    } catch (error) {
      console.error('加载简历列表失败:', error);
      message.error('加载简历列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadResumes();
  }, [refreshTrigger]);

  // 搜索功能
  const handleSearch = (value) => {
    setSearchKeyword(value);
    if (!value.trim()) {
      setFilteredResumes(resumes);
      return;
    }

    const filtered = resumes.filter(resume =>
      Object.values(resume).some(field =>
        field && field.toString().toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredResumes(filtered);
  };

  // 查看详情
  const showDetail = (resume) => {
    setSelectedResume(resume);
    setModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: '姓名',
      key: '姓名',
      width: 100,
      render: (text) => text || <Text type="secondary">未知</Text>,
    },
    {
      title: '性别',
      dataIndex: '性别',
      key: '性别',
      width: 80,
      render: (text) => {
        if (!text) return <Text type="secondary">-</Text>;
        return <Tag color={text === '男' ? 'blue' : 'pink'}>{text}</Tag>;
      },
    },
    {
      title: '年龄',
      dataIndex: '年龄',
      key: '年龄',
      width: 80,
      render: (text) => text || <Text type="secondary">-</Text>,
    },
    {
      title: '学历',
      dataIndex: '学历',
      key: '学历',
      width: 100,
      render: (text) => {
        if (!text) return <Text type="secondary">-</Text>;
        const getColor = (education) => {
          const colors = {
            '博士': 'purple',
            '硕士': 'blue',
            '本科': 'green',
            '专科': 'orange',
            '高中': 'default',
          };
          return colors[education] || 'default';
        };
        return <Tag color={getColor(text)}>{text}</Tag>;
      },
    },
    {
      title: '毕业院校',
      dataIndex: '毕业院校',
      key: '毕业院校',
      width: 150,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">未知</Text>,
    },
    {
      title: '专业',
      dataIndex: '专业',
      key: '专业',
      width: 120,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">未知</Text>,
    },
    {
      title: '求职意向',
      dataIndex: '求职意向',
      key: '求职意向',
      width: 120,
      ellipsis: true,
      render: (text) => text || <Text type="secondary">未知</Text>,
    },
    {
      title: '手机',
      dataIndex: '手机',
      key: '手机',
      width: 120,
      render: (text) => text || <Text type="secondary">未知</Text>,
    },
    {
      title: '录入时间',
      dataIndex: '录入时间',
      key: '录入时间',
      width: 140,
      render: (text) => {
        if (!text) return <Text type="secondary">-</Text>;
        return <Text type="secondary">{text}</Text>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showDetail(record)}
          size="small"
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 渲染详情模态框
  const renderDetailModal = () => {
    if (!selectedResume) return null;

    return (
      <Modal
        title={
          <Space>
            <UserOutlined />
            <span>简历详情 - {selectedResume.姓名 || '未知'}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ maxHeight: '80vh', overflowY: 'auto', padding: '16px' }}>
          <ResumeDetail
            resume={selectedResume}
            onClose={() => setModalVisible(false)}
          />
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>简历列表</span>
            <Text type="secondary">({filteredResumes.length} 条记录)</Text>
          </Space>
        }
        extra={
          <Space>
            <Search
              placeholder="搜索简历（姓名、专业、院校等）"
              allowClear
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) {
                  handleSearch('');
                }
              }}
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadResumes()}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          {filteredResumes.length === 0 && !loading ? (
            <Empty
              description={searchKeyword ? "未找到匹配的简历" : "暂无简历数据"}
              style={{ margin: '40px 0' }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredResumes}
              rowKey={(record, index) => `${record.姓名}_${index}`}
              scroll={{ x: 1200 }}
              pagination={{
                total: filteredResumes.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
              }}
              size="small"
            />
          )}
        </Spin>
      </Card>

      {renderDetailModal()}
    </div>
  );
};

export default ResumeList; 