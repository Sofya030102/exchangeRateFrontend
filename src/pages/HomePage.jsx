// pages/HomePage.jsx
import React from 'react';
import { Typography, Card, Row, Col, List } from 'antd';
import { 
  ThunderboltOutlined, 
  HistoryOutlined, 
  LineChartOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const features = [
    {
      title: 'Мгновенная конвертация',
      description: 'Конвертируйте валюты в реальном времени',
      icon: <ThunderboltOutlined />,
      link: '/converter'
    },
    {
      title: 'История операций',
      description: 'Сохраняйте все ваши конвертации',
      icon: <HistoryOutlined />,
      link: '/history'
    },
    {
      title: 'Аналитика курсов',
      description: 'Следите за изменениями валют',
      icon: <LineChartOutlined />,
      link: '/converter'
    },
    {
      title: 'Надежность',
      description: 'Используем проверенные источники данных',
      icon: <SafetyOutlined />,
      link: '/converter'
    },
  ];

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={1}>Конвертер валют</Title>
        <Paragraph type="secondary" style={{ fontSize: 18 }}>
          Простой и удобный инструмент для конвертации валют с фиксацией курса
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 40 }}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card 
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
              onClick={() => window.location = feature.link}
            >
              <div style={{ fontSize: 32, marginBottom: 16, color: '#1890ff' }}>
                {feature.icon}
              </div>
              <Title level={4}>{feature.title}</Title>
              <Paragraph type="secondary">{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="Как это работает">
        <List
          dataSource={[
            'Выберите валюту которую хотите конвертировать',
            'Выберите валюту в которую хотите конвертировать',
            'Введите сумму',
            'Нажмите "Конвертировать" и получите результат',
            'Сохраните результат в истории (после регистрации)'
          ]}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<div style={{ fontWeight: 'bold' }}>{index + 1}.</div>}
                description={item}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default HomePage;