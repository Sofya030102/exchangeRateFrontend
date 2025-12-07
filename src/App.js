import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ConfigProvider} from 'antd';
import ruRU from 'antd/locale/ru_RU';
import './App.css';
import AnalyticsPage from './pages/AnalyticsPage';


import {AuthProvider} from './context/AuthContext';


import AuthModal from './components/Auth/AuthModal';

import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Main from './components/Layout/Main';

import HomePage from './pages/HomePage';
import ConverterPage from './pages/ConverterPage';
import HistoryPage from './pages/HistoryPage';

function App() {
    return (
        <AuthProvider>
            <ConfigProvider locale={ruRU}>
                <Router>
                    <div className="app">
                        <Header/>
                        <AuthModal />
                        <Main>
                            <Routes>
                                <Route path="/analytics" element={<AnalyticsPage/>}/>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/converter" element={<ConverterPage/>}/>
                                <Route path="/history" element={<HistoryPage/>}/>
                            </Routes>
                        </Main>
                        <Footer/>
                    </div>
                </Router>
            </ConfigProvider>
        </AuthProvider>
    );
}

export default App;