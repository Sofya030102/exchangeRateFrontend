import React, { useState } from 'react';
import { Card, Table, Tag, Typography } from 'antd';
import { ThunderboltOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const OptimalTime = () => {
  const [currency, setCurrency] = useState('USD');
  
  const optimalTimes = [
    {
      pair: 'USD/RUB',
      bestDay: 'Понедельник',
      bestHour: '10:00',
      worstDay: 'Пятница',
      explanation: 'По понедельникам банки обновляют курсы'
    },
    {
      pair: 'EUR/RUB',
      bestDay: 'Среда',
      bestHour: '14:00',
      worstDay: 'Понедельник',
      explanation: 'Влияние европейской торговой сессии'
    }
  ];

  const columns = [
    {
      title: 'Пара',
      dataIndex: 'pair',
      key: 'pair',
    },
    {
      title: 'Лучший день',
      dataIndex: 'bestDay',
      key: 'bestDay',
      render: (text) => <Tag color="green">{text}</Tag>
    },
    {
      title: 'Лучшее время',
      dataIndex: 'bestHour',
      key: 'bestHour',
      render: (text) => (
        <span>
          <ClockCircleOutlined /> {text}
        </span>
      )
    },
    {
      title: 'Худший день',
      dataIndex: 'worstDay',
      key: 'worstDay',
      render: (text) => <Tag color="red">{text}</Tag>
    },
    {
      title: 'Объяснение',
      dataIndex: 'explanation',
      key: 'explanation',
    },
  ];

  return (
    <Card 
      title={
        <span>
          <ThunderboltOutlined /> Оптимальное время для конвертации
        </span>
      }
      style={{ marginTop: 20 }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
        Анализ исторических данных показывает лучшее время для операций
      </Text>
      
      <Table
        columns={columns}
        dataSource={optimalTimes}
        pagination={false}
        rowKey="pair"
      />
      
      <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f5ff', borderRadius: 6 }}>
        <Title level={5}>📈 Советы:</Title>
        <ul>
          <li>Конвертируйте утром, когда рынки только открываются</li>
          <li>Избегайте пятницы вечером - банки могут завышать курсы</li>
          <li>Следите за новостями центральных банков</li>
          <li>Используйте лимитные ордера для фиксации курса</li>
        </ul>
      </div>
    </Card>
  );
};

export default OptimalTime;