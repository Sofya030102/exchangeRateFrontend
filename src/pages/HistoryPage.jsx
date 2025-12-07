import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Popconfirm, Tag, Space, Empty } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { getHistory, clearHistory, deleteHistoryItem } from '../services/localStorage';
import { convertCurrency } from '../services/currencyApi';

const { Title, Text } = Typography;

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleDeleteItem = (id) => {
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleRepeatConversion = async (item) => {
    setLoading(true);
    try {
      const result = await convertCurrency(item.amount, item.from, item.to);
      alert(`Повторная конвертация: ${item.amount} ${item.from} = ${result.result.toFixed(2)} ${item.to}`);
    } catch (error) {
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Дата',
      dataIndex: 'savedAt',
      key: 'savedAt',
      render: (text) => new Date(text).toLocaleString(),
      sorter: (a, b) => new Date(b.savedAt) - new Date(a.savedAt),
    },
    {
      title: 'Операция',
      key: 'operation',
      render: (_, record) => (
        <Space>
          <Text strong>{record.amount}</Text>
          <Tag color="blue">{record.from}</Tag>
          <span>→</span>
          <Text strong>{record.result.toFixed(2)}</Text>
          <Tag color="green">{record.to}</Tag>
        </Space>
      ),
    },
    {
      title: 'Курс',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate, record) => (
        <Text type="secondary">
          1 {record.from} = {rate.toFixed(4)} {record.to}
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
            loading={loading}
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
            <Text type="secondary">Совершите первую конвертацию на главной странице</Text>
          </Empty>
        </Card>
      ) : (
        <Card>
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
              Последняя операция: {history[0] ? new Date(history[0].savedAt).toLocaleDateString() : 'нет'}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;