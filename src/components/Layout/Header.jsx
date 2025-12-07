// components/Layout/Header.jsx
import React, { useState } from 'react';
import { Layout, Tabs, Button, Space, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeOutlined, 
  CalculatorOutlined, 
  HistoryOutlined,
  LineChartOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { TabPane } = Tabs;

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(
    location.pathname === '/' ? 'home' : 
    location.pathname.replace('/', '')
  );

  const handleTabChange = (key) => {
    setActiveKey(key);
    navigate(key === 'home' ? '/' : `/${key}`);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      danger: true,
    },
  ];

  return (
    <AntHeader style={{ 
      background: 'white',
      padding: '0 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderBottom: '1px solid #f0f0f0',
      height: '72px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {/* Логотип */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            💱
          </div>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '18px',
              fontWeight: 600,
              color: '#1f1f1f'
            }}>
              CurrencyMaster
            </h1>
            <div style={{ 
              fontSize: '12px', 
              color: '#8c8c8c',
              marginTop: '-2px'
            }}>
              Конвертер валют
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <Tabs 
          activeKey={activeKey}
          onChange={handleTabChange}
          style={{ marginBottom: 0 }}
          size="large"
        >
          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HomeOutlined />
                Главная
              </span>
            } 
            key="home"
          />
          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalculatorOutlined />
                Конвертер
              </span>
            } 
            key="converter"
          />
          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HistoryOutlined />
                История
              </span>
            } 
            key="history"
          />
          <TabPane 
            tab={
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LineChartOutlined />
                Аналитика
              </span>
            } 
            key="analytics"
          />
        </Tabs>
      </div>

      {/* Правая часть */}
      <Space align="center" size="middle">
        <Button type="text" style={{ color: '#1890ff' }}>
          <Link to="/help">Помощь</Link>
        </Button>
        
        <Dropdown 
          menu={{ items: userMenuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#f5f5f5'
            }
          }}>
            <Avatar 
              style={{ 
                backgroundColor: '#1890ff',
                verticalAlign: 'middle'
              }}
              size="default"
              icon={<UserOutlined />}
            />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '14px', fontWeight: 500 }}>Софья</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Пользователь</div>
            </div>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default AppHeader;