import React from 'react'
// import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import App from './App'
import './index.css'
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

// 修复：移除 StrictMode
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </React.StrictMode>

); // 此时 useEffect 仅执行 1 次
