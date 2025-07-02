import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Space,
  message,
  DatePicker,
  Typography
} from 'antd';
import {
  PlusOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { submitResumeForm } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const ResumeForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 提交表单
  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 处理教育经历数据
      const educationData = values.education?.map(edu => ({
        start_time: edu.time_range?.[0]?.format('YYYY-MM') || '',
        end_time: edu.time_range?.[1]?.format('YYYY-MM') || '',
        school: edu.school || '',
        degree: edu.degree || '',
        major: edu.major || ''
      })) || [];

      // 处理工作经历数据
      const workData = values.work?.map(work => ({
        start_time: work.time_range?.[0]?.format('YYYY-MM') || '',
        end_time: work.time_range?.[1]?.format('YYYY-MM') || work.end_time || '',
        company: work.company || '',
        position: work.position || '',
        responsibilities: work.responsibilities || ''
      })) || [];

      // 构建提交数据
      const submitData = {
        姓名: values.姓名 || '',
        性别: values.性别 || '',
        年龄: values.年龄?.toString() || '',
        政治面貌: values.政治面貌 || '',
        体重: values.体重?.toString() || '',
        籍贯: values.籍贯 || '',
        健康状况: values.健康状况 || '',
        身高: values.身高?.toString() || '',
        学历: values.学历 || '',
        毕业院校: values.毕业院校 || '',
        专业: values.专业 || '',
        求职意向: values.求职意向 || '',
        手机: values.手机 || '',
        邮箱: values.邮箱 || '',
        教育经历: JSON.stringify(educationData),
        荣誉奖项: values.荣誉奖项 || '',
        技能证书: values.技能证书 || '',
        工作经历: JSON.stringify(workData),
        兴趣爱好: values.兴趣爱好 || '',
        自我评价: values.自我评价 || ''
      };

      const response = await submitResumeForm(submitData);
      if (response.success) {
        message.success('简历提交成功！');
        form.resetFields();
        onSuccess && onSuccess();
      } else {
        message.error(response.message || '提交失败，请重试');
      }
    } catch (error) {
      console.error('提交简历失败:', error);
      message.error('提交失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
    message.info('表单已重置');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={3} style={{ margin: '0 0 24px 0', textAlign: 'center', fontWeight: 'normal' }}>
          简历信息填写
        </Title>
        
        <div style={{ border: '2px solid #000', backgroundColor: '#fff' }}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            scrollToFirstError
            requiredMark={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {/* 基本信息表格 */}
            <div style={{ display: 'table', width: '100%' }}>
              {/* 第一行：姓名、性别、年龄 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', width: '12%', verticalAlign: 'middle' }}>姓名</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '21%' }}>
                  <Form.Item name="姓名" style={{ margin: 0 }} rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input placeholder="请输入姓名" style={{ border: 'none', boxShadow: 'none', padding: 0 }} />
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', width: '12%', verticalAlign: 'middle' }}>性别</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '21%' }}>
                  <Form.Item name="性别" style={{ margin: 0 }} rules={[{ required: true, message: '请选择性别' }]}>
                    <Select placeholder="请选择性别" style={{ border: 'none', boxShadow: 'none' }}>
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', width: '12%', verticalAlign: 'middle' }}>年龄</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '22%' }}>
                  <Form.Item name="年龄" style={{ margin: 0 }} rules={[{ required: true, message: '请输入年龄' }]}>
                    <InputNumber min={18} max={65} placeholder="请输入年龄" style={{ border: 'none', boxShadow: 'none', width: '100%' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 第二行：政治面貌、体重、籍贯 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>政治面貌</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="政治面貌" style={{ margin: 0 }}>
                    <Select placeholder="请选择政治面貌" allowClear style={{ border: 'none', boxShadow: 'none' }}>
                      <Option value="中共党员">中共党员</Option>
                      <Option value="中共预备党员">中共预备党员</Option>
                      <Option value="共青团员">共青团员</Option>
                      <Option value="民主党派">民主党派</Option>
                      <Option value="群众">群众</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>体重</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="体重" style={{ margin: 0 }}>
                    <InputNumber min={30} max={150} placeholder="55kg" style={{ border: 'none', boxShadow: 'none', width: '100%' }} />
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>籍贯</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="籍贯" style={{ margin: 0 }}>
                    <Input placeholder="请输入籍贯" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 第三行：健康状况、身高、学历 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>健康状况</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="健康状况" style={{ margin: 0 }}>
                    <Select placeholder="请选择健康状况" allowClear style={{ border: 'none', boxShadow: 'none' }}>
                      <Option value="良好">良好</Option>
                      <Option value="健康">健康</Option>
                      <Option value="一般">一般</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>身高</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="身高" style={{ margin: 0 }}>
                    <InputNumber min={140} max={220} placeholder="165cm" style={{ border: 'none', boxShadow: 'none', width: '100%' }} />
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>学历</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="学历" style={{ margin: 0 }} rules={[{ required: true, message: '请选择学历' }]}>
                    <Select placeholder="请选择学历" style={{ border: 'none', boxShadow: 'none' }}>
                      <Option value="高中">高中</Option>
                      <Option value="中专">中专</Option>
                      <Option value="大专">大专</Option>
                      <Option value="本科">本科</Option>
                      <Option value="硕士">硕士</Option>
                      <Option value="博士">博士</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              {/* 第四行：毕业院校、专业 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>毕业院校</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }}>
                  <Form.Item name="毕业院校" style={{ margin: 0 }}>
                    <Input placeholder="请输入毕业院校" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>专业</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '43%' }} colSpan={3}>
                  <Form.Item name="专业" style={{ margin: 0 }}>
                    <Input placeholder="请输入专业" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 第五行：求职意向 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>求职意向</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '88%' }} colSpan={5}>
                  <Form.Item name="求职意向" style={{ margin: 0 }}>
                    <Input placeholder="请输入求职意向" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 第六行：手机、邮箱 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>手机</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '44%' }} colSpan={2}>
                  <Form.Item name="手机" style={{ margin: 0 }} rules={[{ required: true, message: '请输入手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]}>
                    <Input placeholder="请输入手机号码" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'middle' }}>邮箱</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', width: '44%' }} colSpan={2}>
                  <Form.Item name="邮箱" style={{ margin: 0 }} rules={[{ required: true, message: '请输入邮箱地址' }, { type: 'email', message: '请输入有效的邮箱地址' }]}>
                    <Input placeholder="请输入邮箱地址" style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 教育经历 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>教育经历</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.List name="education">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} style={{ marginBottom: 16, padding: 8, backgroundColor: '#fafafa', border: '1px solid #ddd' }}>
                            <Space align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                              <Form.Item {...restField} name={[name, 'time_range']} rules={[{ required: true, message: '请选择在校时间' }]} style={{ margin: 0 }}>
                                <RangePicker picker="month" placeholder={['开始时间', '结束时间']} />
                              </Form.Item>
                              <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button>
                            </Space>
                            <Space style={{ display: 'flex', gap: 8 }}>
                              <Form.Item {...restField} name={[name, 'school']} rules={[{ required: true, message: '请输入学校名称' }]} style={{ margin: 0, flex: 1 }}>
                                <Input placeholder="学校名称" />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'degree']} rules={[{ required: true, message: '请选择学历层次' }]} style={{ margin: 0, width: 100 }}>
                                <Select placeholder="学历">
                                  <Option value="高中">高中</Option>
                                  <Option value="大专">大专</Option>
                                  <Option value="本科">本科</Option>
                                  <Option value="硕士">硕士</Option>
                                  <Option value="博士">博士</Option>
                                </Select>
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'major']} rules={[{ required: true, message: '请输入专业名称' }]} style={{ margin: 0, flex: 1 }}>
                                <Input placeholder="专业名称" />
                              </Form.Item>
                            </Space>
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                          添加教育经历
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>

              {/* 荣誉奖项 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>荣誉奖项</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.Item name="荣誉奖项" style={{ margin: 0 }}>
                    <TextArea placeholder="请输入获得的荣誉奖项..." rows={3} style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 技能证书 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>技能证书</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.Item name="技能证书" style={{ margin: 0 }}>
                    <TextArea placeholder="请输入拥有的技能证书..." rows={3} style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 工作经历 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>工作经历</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.List name="work">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <div key={key} style={{ marginBottom: 16, padding: 8, backgroundColor: '#fafafa', border: '1px solid #ddd' }}>
                            <Space align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                              <Form.Item {...restField} name={[name, 'time_range']} rules={[{ required: true, message: '请选择工作时间' }]} style={{ margin: 0 }}>
                                <RangePicker picker="month" placeholder={['开始时间', '结束时间']} />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'end_time']} style={{ margin: 0 }}>
                                <Input placeholder="或输入结束时间(如：至今)" style={{ width: 150 }} />
                              </Form.Item>
                              <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button>
                            </Space>
                            <Space style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                              <Form.Item {...restField} name={[name, 'company']} rules={[{ required: true, message: '请输入公司名称' }]} style={{ margin: 0, flex: 1 }}>
                                <Input placeholder="公司名称" />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'position']} rules={[{ required: true, message: '请输入职位名称' }]} style={{ margin: 0, flex: 1 }}>
                                <Input placeholder="职位名称" />
                              </Form.Item>
                            </Space>
                            <Form.Item {...restField} name={[name, 'responsibilities']} rules={[{ required: true, message: '请输入主要职责' }]} style={{ margin: 0 }}>
                              <TextArea placeholder="请详细描述工作职责和成就..." rows={4} />
                            </Form.Item>
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                          添加工作经历
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              </div>

              {/* 兴趣爱好 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>兴趣爱好</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.Item name="兴趣爱好" style={{ margin: 0 }}>
                    <TextArea placeholder="请输入兴趣爱好..." rows={2} style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>

              {/* 自我评价 */}
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px', backgroundColor: '#f5f5f5', verticalAlign: 'top' }}>自我评价</div>
                <div style={{ display: 'table-cell', border: '1px solid #000', padding: '8px' }} colSpan={5}>
                  <Form.Item name="自我评价" style={{ margin: 0 }}>
                    <TextArea placeholder="请进行自我评价..." rows={3} style={{ border: 'none', boxShadow: 'none' }} />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>

        {/* 提交按钮 */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Space size="large">
            <Button size="large" icon={<ReloadOutlined />} onClick={onReset}>
              重置表单
            </Button>
            <Button type="primary" size="large" htmlType="submit" loading={loading} icon={<SaveOutlined />} onClick={() => form.submit()}>
              提交简历
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm; 