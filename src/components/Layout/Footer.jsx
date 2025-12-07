// components/Layout/Footer.jsx
import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const AppFooter = () => {
  return (
    <AntFooter style={{ textAlign: 'center', padding: '20px 50px' }}>
      <Text type="secondary">
        Конвертер валют ©{new Date().getFullYear()} | 
        Курсы обновляются в реальном времени | 
        <Text code>v1.0.0</Text>
      </Text>
    </AntFooter>
  );
};

export default AppFooter;