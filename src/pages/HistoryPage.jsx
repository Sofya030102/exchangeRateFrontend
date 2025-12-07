import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Popconfirm, Tag, Space, Empty, message, Alert } from 'antd';
import { DeleteOutlined, ReloadOutlined, LoginOutlined } from '@ant-design/icons';
import { convertCurrency } from '../services/currencyApi'; // Ця функція вже працює з бекендом

const { Title, Text } = Typography;
const BASE_URL = 'http://127.0.0.1:8000';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            loadHistory();
        }
    }, [token]);

    const loadHistory = async () => {
        setLoading(true);
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
                // Токен прострочився
                localStorage.removeItem('token');
                setToken(null);
                message.error("Сессия истекла. Пожалуйста, войдите снова.");
            }
        } catch (error) {
            message.error("Не удалось загрузить историю");
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
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
        try {
            const response = await fetch(`${BASE_URL}/history/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Видаляємо елемент з локального стейту, щоб не перезавантажувати все
                setHistory(prev => prev.filter(item => item.id !== id));
                message.success("Запись удалена");
            }
        } catch (error) {
            message.error("Не удалось удалить запись");
        }
    };

    const handleRepeatConversion = async (item) => {
        // Використовуємо existing convertCurrency service which uses backend
        try {
            const result = await convertCurrency(item.amount, item.from_currency, item.to_currency);
            message.success(`Обновлено: ${item.amount} ${item.from_currency} = ${result.result.toFixed(2)} ${item.to_currency}`);
            // Опціонально: можна оновити історію, щоб нова операція з'явилася зверху
            loadHistory();
        } catch (error) {
            message.error(`Ошибка: ${error.message}`);
        }
    };

    const columns = [
        {
            title: 'Дата',
            dataIndex: 'timestamp', // Змінено з savedAt на timestamp (як на бекенді)
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
                    {/* Змінено record.from на record.from_currency */}
                    <Tag color="blue">{record.from_currency}</Tag>
                    <span>→</span>
                    <Text strong>{record.result.toFixed(2)}</Text>
                    {/* Змінено record.to на record.to_currency */}
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

    // Якщо користувач не залогінений
    if (!token) {
        return (
            <Card style={{ textAlign: 'center', marginTop: 50 }}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Вы не авторизованы"
                >
                    <Text type="secondary">Войдите в систему, чтобы сохранять и просматривать историю конвертаций.</Text>
                    <br /><br />
                    <Button type="primary" href="/login" icon={<LoginOutlined />}>
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