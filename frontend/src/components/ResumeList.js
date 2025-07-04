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
  Spin,
  Popconfirm,
  Row,
  Col,
  InputNumber,
  Form,
  Select
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  UserOutlined,
  DeleteOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { getResumes, deleteResume, exportToExcel } from '../services/api';
import ResumeDetail from './ResumeDetail';

const { Text } = Typography;

const ResumeList = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(false);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    minAge: null,
    maxAge: null,
    minWorkYears: null,
    maxWorkYears: null,
    gender: '',
    politicalStatus: ''
  });

  // 加载简历列表
  const loadResumes = async (keyword = '', filterParams = {}) => {
    setLoading(true);
    try {
      const response = await getResumes(keyword, filterParams);
      if (response.success) {
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

  // 应用筛选
  const applyFilters = () => {
    loadResumes(searchKeyword, filters);
  };

  // 重置筛选
  const resetFilters = () => {
    setSearchKeyword('');
    setFilters({
      minAge: null,
      maxAge: null,
      minWorkYears: null,
      maxWorkYears: null,
      gender: '',
      politicalStatus: ''
    });
    loadResumes('', {});
  };

  // 查看详情
  const showDetail = (resume, index) => {
    setSelectedResume(resume);
    setSelectedIndex(index);
    setModalVisible(true);
  };

  // 翻页功能
  const showPreviousResume = () => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedResume(filteredResumes[newIndex]);
      setSelectedIndex(newIndex);
    }
  };

  const showNextResume = () => {
    if (selectedIndex < filteredResumes.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedResume(filteredResumes[newIndex]);
      setSelectedIndex(newIndex);
    }
  };

  // 删除简历
  const handleDelete = async (resume) => {
    try {
      // 使用姓名和录入时间作为唯一标识符进行删除
      const uniqueId = `${resume.姓名}_${resume.录入时间}`;
      const response = await deleteResume(uniqueId);
      if (response.success) {
        message.success('简历删除成功');
        loadResumes(searchKeyword, filters); // 重新加载列表
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      console.error('删除简历失败:', error);
      message.error('删除简历失败，请重试');
    }
  };

  // 导出Excel
  const handleExportExcel = async () => {
    try {
      message.loading('正在导出Excel文件...', 2);
      
      const response = await exportToExcel(filters, searchKeyword);
      
      if (response.success && response.data) {
        // 将hex字符串转换为二进制数据
        const hexString = response.data;
        const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        
        // 创建blob对象
        const blob = new Blob([bytes], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // 创建下载链接
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename || '简历数据导出.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        message.success(response.message || '导出成功');
      } else {
        message.error('导出失败：' + response.message);
      }
    } catch (error) {
      console.error('导出Excel失败:', error);
      message.error('导出Excel失败，请重试');
    }
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
      width: 150,
      fixed: 'right',
      render: (_, record, index) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record, index)}
            size="small"
          >
            查看
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条简历记录吗？此操作不可恢复。"
            onConfirm={() => handleDelete(record)}
            okText="确认"
            cancelText="取消"
            okType="danger"
          >
            <Button
              type="link"
              icon={<DeleteOutlined />}
              size="small"
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
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
            // 翻页相关参数
            currentIndex={selectedIndex}
            totalCount={filteredResumes.length}
            canGoPrevious={selectedIndex > 0}
            canGoNext={selectedIndex < filteredResumes.length - 1}
            onPrevious={showPreviousResume}
            onNext={showNextResume}
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
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExportExcel}
              disabled={filteredResumes.length === 0}
            >
              导出Excel
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => loadResumes(searchKeyword, filters)}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
      >
        {/* 搜索和筛选面板 */}
        <div style={{ marginBottom: 16 }}>
          {/* 搜索框 */}
          <div style={{ marginBottom: 16 }}>
            <Input
              placeholder="搜索简历（姓名、专业、院校等）"
              allowClear
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{ width: 400 }}
              prefix={<SearchOutlined />}
            />
          </div>
          
          {/* 筛选面板 */}
          <div style={{ 
            padding: '16px 0', 
            borderBottom: '1px solid #e8e8e8',
            marginBottom: '24px' 
          }}>
            <Row gutter={[24, 16]} align="middle">
              <Col span={5}>
                <div>
                  <Text style={{ 
                    fontWeight: 600, 
                    color: '#1f1f1f', 
                    fontSize: '14px',
                    marginBottom: 8, 
                    display: 'block'
                  }}>
                    年龄筛选
                  </Text>
                  <Row gutter={8}>
                    <Col span={11}>
                      <InputNumber
                        placeholder="最小年龄"
                        value={filters.minAge}
                        onChange={(value) => setFilters(prev => ({ ...prev, minAge: value }))}
                        min={18}
                        max={65}
                        style={{ width: '100%' }}
                        size="small"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center', lineHeight: '24px' }}>
                      <Text type="secondary">-</Text>
                    </Col>
                    <Col span={11}>
                      <InputNumber
                        placeholder="最大年龄"
                        value={filters.maxAge}
                        onChange={(value) => setFilters(prev => ({ ...prev, maxAge: value }))}
                        min={18}
                        max={65}
                        style={{ width: '100%' }}
                        size="small"
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={5}>
                <div>
                  <Text style={{ 
                    fontWeight: 600, 
                    color: '#1f1f1f', 
                    fontSize: '14px',
                    marginBottom: 8, 
                    display: 'block'
                  }}>
                    工作年限筛选
                  </Text>
                  <Row gutter={8}>
                    <Col span={11}>
                      <InputNumber
                        placeholder="最小年限"
                        value={filters.minWorkYears}
                        onChange={(value) => setFilters(prev => ({ ...prev, minWorkYears: value }))}
                        min={0}
                        max={30}
                        style={{ width: '100%' }}
                        size="small"
                      />
                    </Col>
                    <Col span={2} style={{ textAlign: 'center', lineHeight: '24px' }}>
                      <Text type="secondary">-</Text>
                    </Col>
                    <Col span={11}>
                      <InputNumber
                        placeholder="最大年限"
                        value={filters.maxWorkYears}
                        onChange={(value) => setFilters(prev => ({ ...prev, maxWorkYears: value }))}
                        min={0}
                        max={30}
                        style={{ width: '100%' }}
                        size="small"
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col span={4}>
                <div>
                  <Text style={{ 
                    fontWeight: 600, 
                    color: '#1f1f1f', 
                    fontSize: '14px',
                    marginBottom: 8, 
                    display: 'block'
                  }}>
                    性别筛选
                  </Text>
                  <Select
                    placeholder="选择性别"
                    value={filters.gender}
                    onChange={(value) => setFilters(prev => ({ ...prev, gender: value }))}
                    style={{ width: '100%' }}
                    size="small"
                    allowClear
                    options={[
                      { value: '男', label: '男' },
                      { value: '女', label: '女' }
                    ]}
                  />
                </div>
              </Col>
              <Col span={5}>
                <div>
                  <Text style={{ 
                    fontWeight: 600, 
                    color: '#1f1f1f', 
                    fontSize: '14px',
                    marginBottom: 8, 
                    display: 'block'
                  }}>
                    政治面貌筛选
                  </Text>
                  <Select
                    placeholder="选择政治面貌"
                    value={filters.politicalStatus}
                    onChange={(value) => setFilters(prev => ({ ...prev, politicalStatus: value }))}
                    style={{ width: '100%' }}
                    size="small"
                    allowClear
                    options={[
                      { value: '中共党员', label: '中共党员' },
                      { value: '共青团员', label: '共青团员' },
                      { value: '群众', label: '群众' },
                      { value: '民主党派', label: '民主党派' }
                    ]}
                  />
                </div>
              </Col>
              <Col span={5}>
                <div style={{ paddingTop: '22px' }}>
                  <Space>
                    <Button type="primary" onClick={applyFilters} size="small">
                      搜索与筛选
                    </Button>
                    <Button onClick={resetFilters} size="small">
                      重置
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <Spin spinning={loading}>
          {filteredResumes.length === 0 && !loading ? (
            <Empty
              description={searchKeyword || Object.values(filters).some(v => v !== null) ? "未找到匹配的简历" : "暂无简历数据"}
              style={{ margin: '40px 0' }}
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredResumes}
              rowKey={(record, index) => `${record.姓名}_${index}`}
              scroll={{ x: 1300 }}
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