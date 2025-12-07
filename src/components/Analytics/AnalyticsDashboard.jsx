import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Select, Progress, Spin, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/charts';

const { Option } = Select;
const BASE_URL = 'http://127.0.0.1:8000';

const AnalyticsDashboard = () => {
    const [selectedPair, setSelectedPair] = useState('USD/RUB');
    const [period, setPeriod] = useState('7');


    const [reportData, setReportData] = useState(null);
    const [comparisonData, setComparisonData] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchReport = async () => {
        setLoading(true);
        const [from, to] = selectedPair.split('/');

        try {
            const response = await fetch(`${BASE_URL}/analytics/report?from_curr=${from}&to_curr=${to}&days=${period}`);
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
            } else {
                message.error("Не удалось загрузить аналитику");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    const fetchComparison = async () => {
        try {
            const response = await fetch(`${BASE_URL}/analytics/comparison`);
            if (response.ok) {
                const data = await response.json();
                setComparisonData(data);
            }
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchReport();
    }, [selectedPair, period]);


    useEffect(() => {
        fetchComparison();
    }, []);


    const chartConfig = {
        data: reportData?.history || [],
        xField: 'date',
        yField: 'rate',
        point: { size: 4, shape: 'diamond' },
        color: '#1890ff',
        smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 1000,
            },
        },
        interactions: [{ type: 'marker-active' }],
    };

    return (
        <div>
            <h2 style={{ marginBottom: 24 }}>📊 Аналитика курсов валют (Live)</h2>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card loading={loading}>
                        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                            <Select value={selectedPair} onChange={setSelectedPair} style={{ width: 150 }} size="large">
                                <Option value="USD/RUB">USD/RUB</Option>
                                <Option value="EUR/RUB">EUR/RUB</Option>
                                <Option value="GBP/RUB">GBP/RUB</Option>
                                <Option value="EUR/USD">EUR/USD</Option>
                                <Option value="USD/JPY">USD/JPY</Option>
                            </Select>

                            <Select value={period} onChange={setPeriod} style={{ width: 150 }} size="large">
                                <Option value="7">7 дней</Option>
                                <Option value="14">14 дней</Option>
                                <Option value="30">30 дней</Option>
                                <Option value="90">90 дней</Option>
                            </Select>
                        </div>


                        <div style={{ height: 350 }}>
                            {reportData?.history && reportData.history.length > 0 ? (
                                <Line {...chartConfig} />
                            ) : (
                                <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>
                                    Нет данных для отображения графика
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>


            {reportData && (
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title={`Изменение за ${period} дней`}
                                value={Math.abs(reportData.change_percent)}
                                precision={2}
                                valueStyle={{ color: reportData.change_percent >= 0 ? '#3f8600' : '#cf1322' }}
                                prefix={reportData.change_percent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                suffix="%"
                            />
                            <div style={{ marginTop: 10 }}>
                                <Progress
                                    percent={Math.min(Math.abs(reportData.change_percent) * 10, 100)}
                                    status={reportData.change_percent >= 0 ? "success" : "exception"}
                                    showInfo={false}
                                    size="small"
                                />
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Волатильность рынка"
                                value={reportData.volatility}
                                precision={2}
                                suffix="%"
                                prefix={<LineChartOutlined />}
                            />
                            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                                {reportData.volatility < 1 ? "Низкая (Стабильно)" : reportData.volatility < 2.5 ? "Средняя" : "Высокая (Риск)"}
                            </div>
                        </Card>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Рекомендация AI"
                                value={reportData.recommendation.split(' ')[0]}
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<PieChartOutlined />}
                            />
                            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                                {reportData.recommendation}
                            </div>
                        </Card>
                    </Col>
                </Row>
            )}


            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                <Col span={24}>
                    <Card title="Сравнение популярных пар (24ч)">
                        <Table
                            columns={[
                                { title: 'Валюта', dataIndex: 'currency', key: 'currency' },
                                {
                                    title: 'Изменение',
                                    dataIndex: 'change',
                                    key: 'change',
                                    render: (text) => (
                                        <span style={{ color: text.includes('+') ? 'green' : 'red' }}>{text}</span>
                                    )
                                },
                                { title: 'Тренд', dataIndex: 'trend', key: 'trend' },
                                {
                                    title: 'Рекомендация',
                                    dataIndex: 'recommendation',
                                    key: 'recommendation',
                                    render: (text) => (
                                        <span style={{
                                            backgroundColor: text === 'Покупать' ? '#f6ffed' : '#fff1f0',
                                            padding: '4px 8px',
                                            borderRadius: 4,
                                            border: `1px solid ${text === 'Покупать' ? '#b7eb8f' : '#ffa39e'}`
                                        }}>
                      {text}
                    </span>
                                    )
                                },
                            ]}
                            dataSource={comparisonData}
                            pagination={false}
                            loading={comparisonData.length === 0}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AnalyticsDashboard;