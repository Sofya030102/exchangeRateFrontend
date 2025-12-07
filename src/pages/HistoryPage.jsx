import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Card, Typography, Popconfirm, Tag, Space, Empty, message } from 'antd';
import { DeleteOutlined, ReloadOutlined, LoginOutlined } from '@ant-design/icons';
import { convertCurrency } from '../services/currencyApi';
import { AuthContext } from '../context/AuthContext';

const { Title, Text } = Typography;
const BASE_URL = 'http://127.0.0.1:8000';

const HistoryPage = () => {

    const { user, openAuthModal } = useContext(AuthContext);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (user) {
            loadHistory();
        } else {
            setHistory([]);
        }
    }, [user]);

    const loadHistory = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                message.error("Сессия истекла. Пожалуйста, войдите снова.");
            }
        } catch (error) {
            message.error("Не удалось загрузить историю");
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/history`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setHistory([]);
                message.success("История очищена");
            }
        } catch (error) {
            message.error("Ошибка при очистке");
        }
    };

    const handleDeleteItem = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${BASE_URL}/history/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
                message.success("Запись удалена");
            }
        } catch (error) {
            message.error("Не удалось удалить запись");
        }
    };

    const handleRepeatConversion = async (item) => {
        try {
            const result = await convertCurrency(item.amount, item.from_currency, item.to_currency);
            message.success(`Обновлено: ${item.amount} ${item.from_currency} = ${result.result.toFixed(2)} ${item.to_currency}`);
            loadHistory();
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        }
    };

    const columns = [
        {
            title: 'Дата',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => new Date(text).toLocaleString(),
            sorter: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        },
        {
            title: 'Операция',
            key: 'operation',
            render: (_, record) => (
                <Space>
                    <Text strong>{record.amount}</Text>
                    <Tag color="blue">{record.from_currency}</Tag>
                    <span>→</span>
                    <Text strong>{record.result.toFixed(2)}</Text>
                    <Tag color="green">{record.to_currency}</Tag>
                </Space>
            ),
        },
        {
            title: 'Курс',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate, record) => (
                <Text type="secondary">
                    1 {record.from_currency} = {rate.toFixed(4)} {record.to_currency}
                </Text>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={() => handleRepeatConversion(record)}
                    >
                        Повторить
                    </Button>
                    <Popconfirm
                        title="Удалить эту запись?"
                        onConfirm={() => handleDeleteItem(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button size="small" danger icon={<DeleteOutlined />}>
                            Удалить
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    if (!user) {
        return (
            <Card style={{ textAlign: 'center', marginTop: 50 }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Вы не авторизованы"
                >
                    <Text type="secondary">Войдите в систему, чтобы сохранять и просматривать историю конвертаций.</Text>
                    <br /><br />

                    <Button
                        type="primary"
                        icon={<LoginOutlined />}
                        onClick={openAuthModal}
                    >
                        Войти
                    </Button>
                </Empty>
            </Card>
        );
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20
            }}>
                <Title level={2}>История конвертаций</Title>
                {history.length > 0 && (
                    <Popconfirm
                        title="Очистить всю историю?"
                        onConfirm={handleClearHistory}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Очистить историю
                        </Button>
                    </Popconfirm>
                )}
            </div>

            {history.length === 0 ? (
                <Card>
                    <Empty
                        description="История конвертаций пуста"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    >
                        <Text type="secondary">Ваши сохраненные операции появятся здесь</Text>
                    </Empty>
                </Card>
            ) : (
                <Card loading={loading}>
                    <Table
                        columns={columns}
                        dataSource={history}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                    />

                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <Text type="secondary">
                            Всего записей: {history.length} |
                            Последняя операция: {history[0] ? new Date(history[0].timestamp).toLocaleDateString() : 'нет'}
                        </Text>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default HistoryPage;