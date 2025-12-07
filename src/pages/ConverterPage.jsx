import React, { useState, useEffect } from 'react';
import {
    Row, Col, Card, Statistic, List, Tag, Alert,
    Tabs, Typography, Button, Divider
} from 'antd';
import {
    HistoryOutlined,
    FireOutlined,
    ThunderboltOutlined,
    StarOutlined,
    InfoCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined
} from '@ant-design/icons';
import CurrencyConverter from '../components/Converter/CurrencyConverter';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const BASE_URL = 'http://127.0.0.1:8000';

const ConverterPage = () => {
    const [activeTab, setActiveTab] = useState('popular');

    // Стейт для даних з бекенду
    const [currentRates, setCurrentRates] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [stats, setStats] = useState({ count: 0, speed: 0.3, currencies: 0 });
    const [loading, setLoading] = useState(false);

    // 1. Завантаження курсів для сайдбару
    const fetchSidebarRates = async () => {
        try {
            const response = await fetch(`${BASE_URL}/rates/latest/USD`);
            const data = await response.json();

            // data.rates тепер виглядає як: { "EUR": { "rate": 0.95, "change": -0.23 }, ... }

            const ratesArray = Object.entries(data.rates).map(([currency, info]) => ({
                pair: `USD/${currency}`,
                rate: info.rate.toFixed(2),
                // Тепер беремо реальну зміну з бекенду
                change: `${info.change > 0 ? '+' : ''}${info.change}%`,
                // Визначаємо тренд на основі реального числа
                trend: info.change >= 0 ? 'up' : 'down'
            }));

            setCurrentRates(ratesArray);
            setStats(prev => ({ ...prev, currencies: Object.keys(data.rates).length + 5 }));
        } catch (error) {
            console.error("Не вдалося завантажити курси", error);
        }
    };

    // 2. Завантаження історії конвертацій
    const fetchHistory = async () => {
        const token = localStorage.getItem('token'); // Або ключ, де ти зберігаєш токен
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHistoryList(data);

                // Рахуємо конвертації за сьогодні для статистики
                const today = new Date().toDateString();
                const todayCount = data.filter(item => new Date(item.timestamp).toDateString() === today).length;
                setStats(prev => ({ ...prev, count: todayCount }));
            }
        } catch (error) {
            console.error("Помилка завантаження історії", error);
        }
    };

    // Викликаємо при завантаженні сторінки
    useEffect(() => {
        fetchSidebarRates();
        fetchHistory();
    }, []);

    // Цю функцію ми передамо в CurrencyConverter, щоб оновлювати список після успішної конвертації
    const handleConversionSuccess = () => {
        fetchHistory();
        // Також можна оновити статистику
        setStats(prev => ({ ...prev, count: prev.count + 1 }));
    };

    // --- Статичні дані (поки що) ---
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
        'Используйте лимитные ордера для фиксации курса',
        'Избегайте конвертации в выходные дни',
        'Сохраняйте историю для анализа',
    ];

    return (
        <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0 }}>
                    💱 Конвертер валют
                </Title>
                <Text type="secondary">
                    Мгновенная конвертация по актуальным курсам
                </Text>
            </div>

            <Row gutter={[32, 32]}>
                {/* Основной конвертер */}
                <Col xs={24} lg={16}>
                    <Card
                        style={{
                            borderRadius: 16,
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                            border: 'none'
                        }}
                        bodyStyle={{ padding: 32 }}
                    >
                        <div style={{ marginBottom: 24 }}>
                            <Title level={4} style={{ margin: 0 }}>
                                <ThunderboltOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                Быстрая конвертация
                            </Title>
                            <Text type="secondary">
                                Введите сумму и выберите валюты для мгновенного расчета
                            </Text>
                        </div>

                        {/* Важливо: передаємо callback, щоб знати, коли оновити історію */}
                        <CurrencyConverter onSuccess={handleConversionSuccess} />

                        <Divider style={{ margin: '32px 0' }} />

                        <div>
                            <Title level={5} style={{ marginBottom: 16 }}>
                                <HistoryOutlined style={{ marginRight: 8 }} />
                                Последние конвертации
                            </Title>

                            {/* Якщо історії немає або користувач не залогінений */}
                            {historyList.length === 0 ? (
                                <Alert message="История пуста или вы не авторизованы" type="info" showIcon />
                            ) : (
                                <List
                                    size="small"
                                    dataSource={historyList.slice(0, 5)} // Показуємо тільки 5 останніх
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Text>
                                                {item.amount} {item.from_currency} → {item.result.toFixed(2)} {item.to_currency}
                                            </Text>
                                            <Button type="link" size="small">Повторить</Button>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Боковая панель с информацией */}
                <Col xs={24} lg={8}>
                    {/* Текущие курсы (Динамічні) */}
                    <Card
                        title={
                            <span>
                <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                Текущие курсы
              </span>
                        }
                        style={{ marginBottom: 24, borderRadius: 12 }}
                    >
                        <List
                            dataSource={currentRates}
                            loading={currentRates.length === 0}
                            renderItem={(item) => (
                                <List.Item>
                                    <div style={{ flex: 1 }}>
                                        <Text strong>{item.pair}</Text>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: 16, fontWeight: 600 }}>{item.rate}</div>
                                        <Tag
                                            color={item.trend === 'up' ? 'green' : 'red'}
                                            style={{ marginTop: 4, fontSize: 12 }}
                                        >
                                            {item.change}
                                        </Tag>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Card>

                    {/* Популярные валюты */}
                    <Card
                        title={
                            <span>
                <StarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                Популярные валюты
              </span>
                        }
                        style={{ marginBottom: 24, borderRadius: 12 }}
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            size="small"
                        >
                            <TabPane tab="Все" key="all">
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                                    {popularCurrencies.map(currency => (
                                        <div
                                            key={currency.code}
                                            style={{
                                                padding: 12,
                                                borderRadius: 8,
                                                background: '#fafafa',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                            }}
                                        >
                                            <div style={{ fontSize: 24, marginBottom: 8 }}>{currency.flag}</div>
                                            <div style={{ fontWeight: 600 }}>{currency.code}</div>
                                            <div style={{ fontSize: 12, color: '#999' }}>{currency.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </TabPane>
                            <TabPane tab="Избранные" key="favorites">
                                <div style={{ textAlign: 'center', padding: 20 }}>
                                    <StarOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
                                    <Text type="secondary">Добавьте валюты в избранное</Text>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Card>

                    {/* Советы */}
                    <Card
                        title={
                            <span>
                <InfoCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                Советы по конвертации
              </span>
                        }
                        style={{ borderRadius: 12 }}
                    >
                        <List
                            dataSource={tips}
                            renderItem={(tip, index) => (
                                <List.Item style={{ padding: '8px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: 24,
                                            height: 24,
                                            background: '#1890ff',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 12,
                                            flexShrink: 0
                                        }}>
                                            <Text style={{ color: 'white', fontSize: 12 }}>{index + 1}</Text>
                                        </div>
                                        <Text>{tip}</Text>
                                    </div>
                                </List.Item>
                            )}
                        />

                        <Alert
                            message="Актуальность данных"
                            description="Курсы обновляются в реальном времени. Источник: Frankfurter.app + ExchangeRateAPI"
                            type="info"
                            showIcon
                            style={{ marginTop: 16 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Статистика внизу (Динамічна) */}
            <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            textAlign: 'center',
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)'
                        }}
                    >
                        <Statistic
                            title="Ваших конвертаций сегодня"
                            value={stats.count}
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: '#389e0d' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            textAlign: 'center',
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #e6fffb 0%, #b5f5ec 100%)'
                        }}
                    >
                        <Statistic
                            title="Средняя скорость"
                            value={stats.speed}
                            suffix="сек"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#08979c' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card
                        style={{
                            textAlign: 'center',
                            borderRadius: 12,
                            background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)'
                        }}
                    >
                        <Statistic
                            title="Доступных валют"
                            value={stats.currencies || 30}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ConverterPage;