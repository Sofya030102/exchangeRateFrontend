import React, { useState, useEffect } from 'react';
import { Card, Slider, Select, Typography, Tag, Spin, Alert, Row, Col } from 'antd';
import { RiseOutlined, FallOutlined, LineChartOutlined } from '@ant-design/icons';
import { getAvailableCurrencies } from '../../services/currencyApi';

const { Title, Text } = Typography;
const { Option } = Select;

const BASE_URL = 'http://127.0.0.1:8000';

const TrendForecast = () => {
    const [days, setDays] = useState(7);

    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('RUB');

    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);


    useEffect(() => {
        setCurrencies(getAvailableCurrencies());
    }, []);


    const fetchForecast = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/forecast/calculate?from_curr=${fromCurrency}&to_curr=${toCurrency}&days=${days}`
            );

            if (response.ok) {
                const data = await response.json();
                setForecastData(data);
            }
        } catch (error) {
            console.error("Forecast error:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            fetchForecast();
        }, 500);

        return () => clearTimeout(timer);
    }, [days, fromCurrency, toCurrency]);

    return (
        <Card
            title={<span><LineChartOutlined /> Прогноз курса (AI Analytics)</span>}
            style={{ maxWidth: 600, margin: '20px auto', borderRadius: 12 }}
        >
            <div style={{ marginBottom: 20 }}>
                <Text strong>Валютная пара:</Text>
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <Select
                        value={fromCurrency}
                        onChange={setFromCurrency}
                        style={{ width: '50%' }}
                    >
                        {currencies.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                    <Select
                        value={toCurrency}
                        onChange={setToCurrency}
                        style={{ width: '50%' }}
                    >
                        {currencies.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                </div>
            </div>

            <div style={{ marginBottom: 30 }}>
                <Text strong>Прогноз на дней вперед: {days}</Text>
                <Slider
                    min={1}
                    max={30}
                    value={days}
                    onChange={setDays}
                    marks={{ 1: '1 д', 7: '1 нед', 14: '2 нед', 30: '1 мес' }}
                />
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 10 }}>Анализируем тренды...</div>
                </div>
            ) : forecastData ? (
                <div style={{
                    padding: 24,
                    backgroundColor: forecastData.trend === 'up' ? '#f6ffed' : '#fff1f0',
                    borderRadius: 8,
                    textAlign: 'center',
                    border: `1px solid ${forecastData.trend === 'up' ? '#b7eb8f' : '#ffa39e'}`
                }}>
                    <Title level={3} style={{ margin: 0 }}>
                        ~ {forecastData.forecast_rate} {toCurrency}
                    </Title>

                    <div style={{ margin: '12px 0' }}>
                        <Tag
                            color={forecastData.trend === 'up' ? 'success' : 'error'}
                            style={{ fontSize: 16, padding: '5px 10px' }}
                        >
                            {forecastData.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                            {' '} {forecastData.change_percent > 0 ? '+' : ''}{forecastData.change_percent}%
                        </Tag>
                    </div>

                    <Row gutter={16} style={{ marginTop: 20, textAlign: 'left' }}>
                        <Col span={12}>
                            <Text type="secondary">Текущий курс:</Text>
                            <div><strong>{forecastData.current_rate} {toCurrency}</strong></div>
                        </Col>
                        <Col span={12}>
                            <Text type="secondary">Рекомендация:</Text>
                            <div><strong>{forecastData.recommendation}</strong></div>
                        </Col>
                    </Row>

                    <div style={{ marginTop: 15, textAlign: 'left' }}>
                        <Text type="secondary">Уверенность прогноза:</Text>
                        <div style={{
                            height: 6,
                            background: '#e8e8e8',
                            borderRadius: 3,
                            marginTop: 5,
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${forecastData.confidence}%`,
                                background: forecastData.confidence > 70 ? '#52c41a' : '#faad14',
                                height: '100%'
                            }} />
                        </div>
                        <Text style={{ fontSize: 12 }} type="secondary">{forecastData.confidence}%</Text>
                    </div>
                </div>
            ) : (
                <Alert message="Нет данных для прогноза" type="warning" />
            )}

            <div style={{ marginTop: 20, fontSize: 11, color: '#999', textAlign: 'center' }}>
                ⚠️ Алгоритм базируется на трендах последних 24 часов. Не является финансовым советом.
            </div>
        </Card>
    );
};

export default TrendForecast;