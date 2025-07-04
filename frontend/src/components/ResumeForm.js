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
  ReloadOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { submitResumeForm, generateResumeData } from '../services/api';
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
        start_time: edu.time_range?.[0] ? edu.time_range[0].format('YYYY-MM') : '',
        end_time: edu.time_range?.[1] ? edu.time_range[1].format('YYYY-MM') : '',
        school: edu.school || '',
        degree: edu.degree || '',
        major: edu.major || ''
      })) || [];

      // 处理工作经历数据
      const workData = values.work?.map(work => ({
        start_time: work.time_range?.[0] ? work.time_range[0].format('YYYY-MM') : '',
        end_time: work.time_range?.[1] ? work.time_range[1].format('YYYY-MM') : (work.end_time || ''),
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
        荣誉奖项: Array.isArray(values.荣誉奖项) ? values.荣誉奖项.join(',') : (values.荣誉奖项 || ''),
        技能证书: Array.isArray(values.技能证书) ? values.技能证书.join(',') : (values.技能证书 || ''),
        工作经历: JSON.stringify(workData),
        兴趣爱好: Array.isArray(values.兴趣爱好) ? values.兴趣爱好.join(',') : (values.兴趣爱好 || ''),
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

  // AI生成测试数据
  const onGenerateData = async () => {
    setLoading(true);
    
    // 显示详细的进度提示
    const progressMessages = [
      'AI正在分析数据模式...',
      '正在生成个人信息...',
      '正在构建教育经历...',
      '正在创建工作履历...',
      '正在完善简历细节...'
    ];
    
    let messageIndex = 0;
    message.loading({ content: progressMessages[messageIndex], key: 'generating' });
    
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % progressMessages.length;
      message.loading({ content: progressMessages[messageIndex], key: 'generating' });
    }, 8000); // 每8秒更新一次提示
    
    try {
      const response = await generateResumeData();
      clearInterval(progressInterval); // 清除进度更新
      
      if (response.success && response.data) {
        const aiData = response.data;
        
        // 处理教育经历数据
        const educationFields = [];
        if (aiData.教育经历 && Array.isArray(aiData.教育经历)) {
          aiData.教育经历.forEach(edu => {
            educationFields.push({
              time_range: [
                edu.start_time ? dayjs(edu.start_time, 'YYYY-MM') : null,
                edu.end_time ? dayjs(edu.end_time, 'YYYY-MM') : null
              ],
              school: edu.school || '',
              degree: edu.degree || '',
              major: edu.major || ''
            });
          });
        }
        
        // 处理工作经历数据
        const workFields = [];
        if (aiData.工作经历 && Array.isArray(aiData.工作经历)) {
          aiData.工作经历.forEach(work => {
            workFields.push({
              time_range: [
                work.start_time ? dayjs(work.start_time, 'YYYY-MM') : null,
                work.end_time && work.end_time !== '至今' ? dayjs(work.end_time, 'YYYY-MM') : null
              ],
              end_time: work.end_time === '至今' ? '至今' : '',
              company: work.company || '',
              position: work.position || '',
              responsibilities: work.responsibilities || ''
            });
          });
        }
        
        // 构建表单数据
        const formData = {
          姓名: aiData.姓名 || '',
          性别: aiData.性别 || '',
          年龄: aiData.年龄 ? parseInt(aiData.年龄) : undefined,
          政治面貌: aiData.政治面貌 || '',
          体重: aiData.体重 ? parseInt(aiData.体重) : undefined,
          籍贯: aiData.籍贯 || '',
          健康状况: aiData.健康状况 || '',
          身高: aiData.身高 ? parseInt(aiData.身高) : undefined,
          学历: aiData.学历 || '',
          毕业院校: aiData.毕业院校 || '',
          专业: aiData.专业 || '',
          求职意向: aiData.求职意向 || '',
          手机: aiData.手机 || '',
          邮箱: aiData.邮箱 || '',
          荣誉奖项: aiData.荣誉奖项 || '',
          技能证书: aiData.技能证书 || '',
          兴趣爱好: aiData.兴趣爱好 || '',
          自我评价: aiData.自我评价 || '',
          education: educationFields,
          work: workFields
        };
        
        // 填充表单
        form.setFieldsValue(formData);
        
        message.success({ 
          content: `AI生成成功！创建了${aiData.姓名}（${aiData.年龄}岁）的简历数据`, 
          key: 'generating', 
          duration: 3 
        });
      } else {
        message.error({ content: response.message || 'AI生成数据失败', key: 'generating', duration: 2 });
      }
    } catch (error) {
      clearInterval(progressInterval); // 确保清除进度更新
      console.error('AI生成数据失败:', error);
      
      // 根据错误类型显示不同提示
      let errorMessage = 'AI生成数据失败，请重试';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'AI生成耗时较长，已增加重试机制，请稍后再试';
      } else if (error.response?.status === 408) {
        errorMessage = 'AI生成超时，服务正在重试中，请稍等片刻再试';
      } else if (error.response?.status >= 500) {
        errorMessage = '服务器繁忙，AI生成暂时失败，请稍后重试';
      } else if (error.response?.status === 502) {
        errorMessage = 'AI服务连接异常，请检查网络后重试';
      }
      
      message.error({ content: errorMessage, key: 'generating', duration: 3 });
    } finally {
      clearInterval(progressInterval); // 确保清除进度更新
      setLoading(false);
    }
  };

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

  const inputStyle = {
    border: 'none',
    boxShadow: 'none',
    width: '100%'
  };

  const multilineStyle = {
    ...cellStyle,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: '60px'
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={3} style={{ margin: '0 0 16px 0', textAlign: 'center', fontWeight: 'normal' }}>
          简历信息填写
        </Title>
        
        {/* AI生成按钮 */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button 
            type="link" 
            size="small"
            icon={<RobotOutlined />} 
            onClick={onGenerateData}
            loading={loading}
            style={{ 
              color: '#1890ff',
              padding: 0,
              height: 'auto'
            }}
          >
            AI生成测试数据
          </Button>
        </div>
        
        <Form
          form={form}
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            border: '2px solid #000',
            fontFamily: '宋体, SimSun, "Microsoft YaHei", sans-serif',
            fontSize: '14px',
            width: '100%',
            backgroundColor: '#fff'
          }}>
            
            {/* 第一行：姓名、性别、年龄 */}
            <div style={labelStyle}>姓名</div>
            <div style={cellStyle}>
              <Form.Item name="姓名" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请输入姓名' }]}>
                <Input placeholder="请输入姓名" style={inputStyle} />
              </Form.Item>
            </div>
            <div style={labelStyle}>性别</div>
            <div style={cellStyle}>
              <Form.Item name="性别" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请选择性别' }]}>
                <Select placeholder="请选择性别" style={inputStyle}>
                  <Option value="男">男</Option>
                  <Option value="女">女</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={labelStyle}>年龄</div>
            <div style={cellStyle}>
              <Form.Item name="年龄" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请输入年龄' }]}>
                <InputNumber min={18} max={65} placeholder="请输入年龄" style={inputStyle} />
              </Form.Item>
            </div>

            {/* 第二行：政治面貌、体重、籍贯 */}
            <div style={labelStyle}>政治面貌</div>
            <div style={cellStyle}>
              <Form.Item name="政治面貌" style={{ margin: 0, width: '100%' }}>
                <Select placeholder="请选择政治面貌" allowClear style={inputStyle}>
                  <Option value="中共党员">中共党员</Option>
                  <Option value="中共预备党员">中共预备党员</Option>
                  <Option value="共青团员">共青团员</Option>
                  <Option value="民主党派">民主党派</Option>
                  <Option value="群众">群众</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={labelStyle}>体重</div>
            <div style={cellStyle}>
              <Form.Item name="体重" style={{ margin: 0, width: '100%' }}>
                <InputNumber min={30} max={150} placeholder="55kg" style={inputStyle} />
              </Form.Item>
            </div>
            <div style={labelStyle}>籍贯</div>
            <div style={cellStyle}>
              <Form.Item name="籍贯" style={{ margin: 0, width: '100%' }}>
                <Input placeholder="请输入籍贯" style={inputStyle} />
              </Form.Item>
            </div>

            {/* 第三行：健康状况、身高、学历 */}
            <div style={labelStyle}>健康状况</div>
            <div style={cellStyle}>
              <Form.Item name="健康状况" style={{ margin: 0, width: '100%' }}>
                <Select placeholder="请选择健康状况" allowClear style={inputStyle}>
                  <Option value="良好">良好</Option>
                  <Option value="健康">健康</Option>
                  <Option value="一般">一般</Option>
                </Select>
              </Form.Item>
            </div>
            <div style={labelStyle}>身高</div>
            <div style={cellStyle}>
              <Form.Item name="身高" style={{ margin: 0, width: '100%' }}>
                <InputNumber min={140} max={220} placeholder="165cm" style={inputStyle} />
              </Form.Item>
            </div>
            <div style={labelStyle}>学历</div>
            <div style={cellStyle}>
              <Form.Item name="学历" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请选择学历' }]}>
                <Select placeholder="请选择学历" style={inputStyle}>
                  <Option value="高中">高中</Option>
                  <Option value="中专">中专</Option>
                  <Option value="大专">大专</Option>
                  <Option value="本科">本科</Option>
                  <Option value="硕士">硕士</Option>
                  <Option value="博士">博士</Option>
                </Select>
              </Form.Item>
            </div>

            {/* 第四行：毕业院校、专业 */}
            <div style={labelStyle}>毕业院校</div>
            <div style={cellStyle}>
              <Form.Item name="毕业院校" style={{ margin: 0, width: '100%' }}>
                <Input placeholder="请输入毕业院校" style={inputStyle} />
              </Form.Item>
            </div>
            <div style={labelStyle}>专业</div>
            <div style={{...cellStyle, gridColumn: 'span 3'}}>
              <Form.Item name="专业" style={{ margin: 0, width: '100%' }}>
                <Input placeholder="请输入专业" style={inputStyle} />
              </Form.Item>
            </div>

            {/* 第五行：求职意向 */}
            <div style={labelStyle}>求职意向</div>
            <div style={{...cellStyle, gridColumn: 'span 5'}}>
              <Form.Item name="求职意向" style={{ margin: 0, width: '100%' }}>
                <Input placeholder="请输入求职意向" style={inputStyle} />
              </Form.Item>
            </div>

            {/* 第六行：手机、邮箱 */}
            <div style={labelStyle}>手机</div>
            <div style={{...cellStyle, gridColumn: 'span 2'}}>
              <Form.Item name="手机" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请输入手机号码' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }]}>
                <Input placeholder="请输入手机号码" style={inputStyle} />
              </Form.Item>
            </div>
            <div style={labelStyle}>邮箱</div>
            <div style={{...cellStyle, gridColumn: 'span 2'}}>
              <Form.Item name="邮箱" style={{ margin: 0, width: '100%' }} rules={[{ required: true, message: '请输入邮箱地址' }, { type: 'email', message: '请输入有效的邮箱地址' }]}>
                <Input placeholder="请输入邮箱地址" style={inputStyle} />
              </Form.Item>
            </div>

            {/* 教育经历 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>教育经历</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.List name="education">
                {(fields, { add, remove }) => (
                  <div style={{ width: '100%' }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ marginBottom: 16, padding: 8, backgroundColor: '#fafafa', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <div style={{ marginBottom: 8 }}>
                          <Space align="baseline" style={{ display: 'flex', width: '100%' }}>
                            <Form.Item {...restField} name={[name, 'time_range']} rules={[{ required: true, message: '请选择在校时间' }]} style={{ margin: 0 }}>
                              <RangePicker picker="month" placeholder={['开始时间', '结束时间']} />
                            </Form.Item>
                            <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button>
                          </Space>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
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
                        </div>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                      添加教育经历
                    </Button>
                  </div>
                )}
              </Form.List>
            </div>

            {/* 荣誉奖项 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>荣誉奖项</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.Item name="荣誉奖项" style={{ margin: 0, width: '100%' }}>
                <TextArea placeholder="请输入获得的荣誉奖项..." rows={3} style={{ border: 'none', boxShadow: 'none', resize: 'vertical' }} />
              </Form.Item>
            </div>

            {/* 技能证书 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>技能证书</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.Item name="技能证书" style={{ margin: 0, width: '100%' }}>
                <TextArea placeholder="请输入拥有的技能证书..." rows={3} style={{ border: 'none', boxShadow: 'none', resize: 'vertical' }} />
              </Form.Item>
            </div>

            {/* 工作经历 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>工作经历</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.List name="work">
                {(fields, { add, remove }) => (
                  <div style={{ width: '100%' }}>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} style={{ marginBottom: 16, padding: 8, backgroundColor: '#fafafa', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <div style={{ marginBottom: 8 }}>
                          <Space align="baseline" style={{ display: 'flex', width: '100%' }}>
                            <Form.Item {...restField} name={[name, 'time_range']} rules={[{ required: true, message: '请选择工作时间' }]} style={{ margin: 0 }}>
                              <RangePicker picker="month" placeholder={['开始时间', '结束时间']} />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, 'end_time']} style={{ margin: 0 }}>
                              <Input placeholder="或输入结束时间(如：至今)" style={{ width: 150 }} />
                            </Form.Item>
                            <Button type="link" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)}>删除</Button>
                          </Space>
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          <Form.Item {...restField} name={[name, 'company']} rules={[{ required: true, message: '请输入公司名称' }]} style={{ margin: 0, flex: 1 }}>
                            <Input placeholder="公司名称" />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'position']} rules={[{ required: true, message: '请输入职位名称' }]} style={{ margin: 0, flex: 1 }}>
                            <Input placeholder="职位名称" />
                          </Form.Item>
                        </div>
                        <Form.Item {...restField} name={[name, 'responsibilities']} rules={[{ required: true, message: '请输入主要职责' }]} style={{ margin: 0 }}>
                          <TextArea placeholder="请详细描述工作职责和成就..." rows={4} />
                        </Form.Item>
                      </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                      添加工作经历
                    </Button>
                  </div>
                )}
              </Form.List>
            </div>

            {/* 兴趣爱好 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>兴趣爱好</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.Item name="兴趣爱好" style={{ margin: 0, width: '100%' }}>
                <TextArea placeholder="请输入兴趣爱好..." rows={2} style={{ border: 'none', boxShadow: 'none', resize: 'vertical' }} />
              </Form.Item>
            </div>

            {/* 自我评价 */}
            <div style={{...labelStyle, alignItems: 'flex-start', paddingTop: '8px'}}>自我评价</div>
            <div style={{...multilineStyle, gridColumn: 'span 5'}}>
              <Form.Item name="自我评价" style={{ margin: 0, width: '100%' }}>
                <TextArea placeholder="请进行自我评价..." rows={3} style={{ border: 'none', boxShadow: 'none', resize: 'vertical' }} />
              </Form.Item>
            </div>

          </div>
        </Form>

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