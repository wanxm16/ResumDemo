import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('响应错误:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * 上传简历文件
 * @param {File} file - 简历文件
 * @returns {Promise} 上传结果
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * 获取简历列表
 * @param {string} keyword - 搜索关键词（可选）
 * @param {number} limit - 结果数量限制
 * @returns {Promise} 简历列表
 */
export const getResumes = async (keyword = '', limit = 100) => {
  const params = { limit };
  if (keyword) {
    params.keyword = keyword;
  }
  
  const response = await api.get('/resumes', { params });
  return response.data;
};

/**
 * 获取系统统计信息
 * @returns {Promise} 统计信息
 */
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

/**
 * 健康检查
 * @returns {Promise} 健康状态
 */
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * 提交简历表单
 * @param {Object} resumeData - 简历表单数据
 * @returns {Promise} 提交结果
 */
export const submitResumeForm = async (resumeData) => {
  const response = await api.post('/submit-form', resumeData);
  return response.data;
};

export default api; 