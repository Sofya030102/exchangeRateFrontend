// components/Layout/Header.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Layout, Tabs, Button, Space, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HomeOutlined,
    CalculatorOutlined,
    HistoryOutlined,
    LineChartOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    LoginOutlined
} from '@ant-design/icons';

// Імпортуємо контекст
import { AuthContext } from '../../context/AuthContext';

const { Header: AntHeader } = Layout;
const { TabPane } = Tabs;

const AppHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Отримуємо дані та функції з контексту
    const { user, logout, openAuthModal } = useContext(AuthContext);

    // Визначаємо активну вкладку на основі URL
    const [activeKey, setActiveKey] = useState('home');

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setActiveKey('home');
        else if (path.includes('converter')) setActiveKey('converter');
        else if (path.includes('history')) setActiveKey('history');
        else if (path.includes('analytics')) setActiveKey('analytics');
    }, [location]);

    const handleTabChange = (key) => {
        setActiveKey(key);
        navigate(key === 'home' ? '/' : `/${key}`);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Меню користувача
    const userMenuItems = {
        items: [
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'Профиль',
                disabled: true, // Поки що не реалізовано
            },
            {
                key: 'settings',
                icon: <SettingOutlined />,
                label: 'Настройки',
                disabled: true,
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Выйти',
                danger: true,
                onClick: handleLogout, // Обробка виходу
            },
        ]
    };

    return (
        <AntHeader style={{
            background: 'white',
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderBottom: '1px solid #f0f0f0',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                {/* Логотип */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
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
                </Link>

                {/* Вкладки */}
                <Tabs
                    activeKey={activeKey}
                    onChange={handleTabChange}
                    style={{ marginBottom: 0 }}
                    size="large"
                >
                    <TabPane
                        tab={<span><HomeOutlined /> Главная</span>}
                        key="home"
                    />
                    <TabPane
                        tab={<span><CalculatorOutlined /> Конвертер</span>}
                        key="converter"
                    />
                    <TabPane
                        tab={<span><HistoryOutlined /> История</span>}
                        key="history"
                    />
                    <TabPane
                        tab={<span><LineChartOutlined /> Аналитика</span>}
                        key="analytics"
                    />
                </Tabs>
            </div>

            {/* Правая часть */}
            <Space align="center" size="middle">
                <Button type="text" style={{ color: '#1890ff' }}>
                    Помощь
                </Button>

                {user ? (
                    // ЯКЩО АВТОРИЗОВАНИЙ
                    <Dropdown menu={userMenuItems} placement="bottomRight" trigger={['click']}>
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
                            >
                                {user.email[0].toUpperCase()}
                            </Avatar>
                            <div style={{ lineHeight: 1.2, display: 'none', sm: 'block' }}>
                                <div style={{ fontSize: '14px', fontWeight: 500 }}>
                                    {user.email.split('@')[0]}
                                </div>
                                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Пользователь</div>
                            </div>
                        </div>
                    </Dropdown>
                ) : (
                    // ЯКЩО НЕ АВТОРИЗОВАНИЙ -> КНОПКА ВІДКРИВАЄ МОДАЛКУ
                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={openAuthModal}
                    >
                        Войти
                    </Button>
                )}
            </Space>
        </AntHeader>
    );
};

export default AppHeader;