
import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const Main = ({ children }) => {
  return (
    <Content style={{ 
      padding: '20px 50px', 
      minHeight: 'calc(100vh - 134px)' 
    }}>
      {children}
    </Content>
  );
};

export default Main;