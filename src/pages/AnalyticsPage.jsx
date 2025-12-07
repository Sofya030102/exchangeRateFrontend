import React from 'react';
import { Row, Col } from 'antd';
import AnalyticsDashboard from '../components/Analytics/AnalyticsDashboard';
import HistoricalCalculator from '../components/Analytics/HistoricalCalculator';
import TrendForecast from '../components/Analytics/TrendForecast';
import OptimalTime from '../components/Analytics/OptimalTime';

const AnalyticsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Аналитика валютных курсов</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <AnalyticsDashboard />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col xs={24} lg={12}>
          <HistoricalCalculator />
        </Col>
        <Col xs={24} lg={12}>
          <TrendForecast />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <OptimalTime />
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsPage;