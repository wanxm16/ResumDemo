import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import './index.css';

// 配置Ant Design的中文本地化
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Layout: {
            bodyBg: '#f0f2f5',
          },
          Card: {
            borderRadius: 8,
          },
          Button: {
            borderRadius: 6,
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
); 