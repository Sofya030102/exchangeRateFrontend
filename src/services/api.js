import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import './App.css';

// Layout компоненты
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Main from './components/Layout/Main';

// Страницы
import HomePage from './pages/HomePage';
import ConverterPage from './pages/ConverterPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <ConfigProvider 
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <div className="app">
          <Header />
          <Main>
            <Routes>
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/converter" element={<ConverterPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </Main>
          <Footer />
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;