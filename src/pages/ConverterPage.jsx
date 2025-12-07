import React, { useState, useEffect, useContext } from 'react';
import {
    Row, Col, Card, Statistic, List, Tag, Alert,
    Tabs, Typography, Button, Divider, Empty, message
} from 'antd';
import {
    HistoryOutlined,
    FireOutlined,
    ThunderboltOutlined,
    StarOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    LoginOutlined
} from '@ant-design/icons';
import CurrencyConverter from '../components/Converter/CurrencyConverter';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BASE_URL = 'http://127.0.0.1:8000';

const ConverterPage = () => {
    const { user, openAuthModal } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('popular');

    const [currentRates, setCurrentRates] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [favoritesList, setFavoritesList] = useState([]);
    const [stats, setStats] = useState({ count: 0, speed: 0.3, currencies: 0 });


    const [quickPair, setQuickPair] = useState(null);


    const fetchSidebarRates = async () => {
        try {
            const response = await fetch(`${BASE_URL}/rates/latest/USD`);
            const data = await response.json();

            const ratesArray = Object.entries(data.rates).map(([currency, info]) => ({
                pair: `USD/${currency}`,
                rate: info.rate.toFixed(2),
                change: `${info.change > 0 ? '+' : ''}${info.change}%`,
                trend: info.change >= 0 ? 'up' : 'down'
            })).slice(0, 5);

            setCurrentRates(ratesArray);
            setStats(prev => ({ ...prev, currencies: Object.keys(data.rates).length + 5 }));
        } catch (error) {
            console.error("Не удалось загрузить курсы", error);
        }
    };


    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setHistoryList([]);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setHistoryList(data);
                const today = new Date().toDateString();
                const todayCount = data.filter(item => new Date(item.timestamp).toDateString() === today).length;
                setStats(prev => ({ ...prev, count: todayCount }));
            }
        } catch (error) {
            console.error("Ошибка загрузки истории", error);
        }
    };


    const fetchFavorites = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setFavoritesList([]);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setFavoritesList(data);
            }
        } catch (error) {
            console.error("Ошибка загрузки избранного", error);
        }
    };

    useEffect(() => {
        fetchSidebarRates();
        if (user) {
            fetchHistory();
            fetchFavorites();
        }
    }, [user]);


    const handleDataUpdate = () => {
        fetchHistory();
        fetchFavorites();
    };


    const handleFavoriteClick = (fav) => {

        setQuickPair({ from: fav.from_currency, to: fav.to_currency });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const popularCurrencies = [
        { code: 'USD', name: 'Доллар США', flag: '🇺🇸', trend: 'up' },
        { code: 'EUR', name: 'Евро', flag: '🇪🇺', trend: 'up' },
        { code: 'RUB', name: 'Российский рубль', flag: '🇷🇺', trend: 'stable' },
        { code: 'GBP', name: 'Фунт стерлингов', flag: '🇬🇧', trend: 'up' },
        { code: 'JPY', name: 'Японская иена', flag: '🇯🇵', trend: 'down' },
        { code: 'CNY', name: 'Китайский юань', flag: '🇨🇳', trend: 'stable' },
    ];

    const tips = [
        'Конвертируйте утром для лучших курсов',
        'Следите за новостями центробанков',
        'Используйте лимитные ордера',
        'Сохраняйте историю для анализа',
    ];

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0 }}>💱 Конвертер валют</Title>
                <Text type="secondary">Мгновенная конвертация по актуальным курсам</Text>
            </div>

            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <Card
                        style={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', border: 'none' }}
                        bodyStyle={{ padding: 32 }}
                    >
                        <div style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ margin: 0 }}>
                                <ThunderboltOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                Быстрая конвертация
                            </Title>
                            <Text type="secondary">Введите сумму и выберите валюты</Text>
                        </div>


                        <CurrencyConverter
                            onSuccess={handleDataUpdate}
                            initialPair={quickPair}
                        />

                        <Divider style={{ margin: '32px 0' }} />

                        <div>
                            <Title level={5} style={{ marginBottom: 16 }}>
                                <HistoryOutlined style={{ marginRight: 8 }} />
                                Последние конвертации
                            </Title>
                            {historyList.length === 0 ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет данных" />
                            ) : (
                                <List
                                    size="small"
                                    dataSource={historyList.slice(0, 5)}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Text>{item.amount} {item.from_currency} → {item.result.toFixed(2)} {item.to_currency}</Text>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => setQuickPair({ from: item.from_currency, to: item.to_currency })}
                                            >
                                                Повторить
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>

                    <Card
                        style={{ marginBottom: 24, borderRadius: 12 }}
                        bodyStyle={{ padding: '12px 24px' }}
                    >
                        <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                            <TabPane tab={<span><FireOutlined /> Популярные</span>} key="popular">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 10 }}>
                                    {popularCurrencies.map(currency => (
                                        <div
                                            key={currency.code}
                                            onClick={() => {
                                                setQuickPair({ from: currency.code, to: 'RUB' });
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            style={{
                                                padding: 12, borderRadius: 8, background: '#fafafa',
                                                textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s'
                                            }}
                                        >
                                            <div style={{ fontSize: 24 }}>{currency.flag}</div>
                                            <div style={{ fontWeight: 600 }}>{currency.code}</div>
                                        </div>
                                    ))}
                                </div>
                            </TabPane>

                            <TabPane tab={<span><StarOutlined /> Избранные</span>} key="favorites">
                                {!user ? (
                                    <div style={{ textAlign: 'center', padding: 20 }}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 10 }}>
                                            Войдите, чтобы видеть избранное
                                        </Text>
                                        <Button type="primary" size="small" icon={<LoginOutlined />} onClick={openAuthModal}>
                                            Войти
                                        </Button>
                                    </div>
                                ) : favoritesList.length === 0 ? (
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Список пуст" />
                                ) : (
                                    <List
                                        size="small"
                                        dataSource={favoritesList}
                                        renderItem={(fav) => (
                                            <List.Item
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleFavoriteClick(fav)}
                                                actions={[<Button type="link" size="small">Use</Button>]}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <StarOutlined style={{ color: '#faad14' }} />
                                                    <Text strong>{fav.from_currency}/{fav.to_currency}</Text>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                )}
                            </TabPane>
                        </Tabs>
                    </Card>


                    <Card title="Курсы (к USD)" size="small" style={{ borderRadius: 12, marginBottom: 24 }}>
                        <List
                            dataSource={currentRates}
                            renderItem={(item) => (
                                <List.Item>
                                    <Text strong>{item.pair}</Text>
                                    <div style={{ textAlign: 'right' }}>
                                        <div>{item.rate}</div>
                                        <Tag color={item.trend === 'up' ? 'green' : 'red'}>{item.change}</Tag>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card title="Советы" size="small" style={{ borderRadius: 12 }}>
                        <List
                            dataSource={tips}
                            renderItem={(tip, index) => (
                                <List.Item>
                                    <Text style={{ fontSize: 12 }}>{index + 1}. {tip}</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ConverterPage;