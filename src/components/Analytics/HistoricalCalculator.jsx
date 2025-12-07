import React, {useState, useEffect} from 'react';
import {Card, DatePicker, InputNumber, Button, Alert, Typography, Select, Row, Col, message} from 'antd';
import {CalculatorOutlined, ArrowRightOutlined} from '@ant-design/icons';
import {getAvailableCurrencies} from '../../services/currencyApi'; // Імпортуємо список валют

const {Title, Text} = Typography;
const {Option} = Select;

const BASE_URL = 'http://127.0.0.1:8000';

const HistoricalCalculator = () => {
    const [amount, setAmount] = useState(1000);
    const [fromCurrency, setFromCurrency] = useState('USD'); // Додали стейт для валют
    const [toCurrency, setToCurrency] = useState('EUR');   // Змінив на EUR за замовчуванням (бо RUB немає історії)

    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);

    // Завантажуємо список валют при старті
    useEffect(() => {
        setCurrencies(getAvailableCurrencies());
    }, []);

    const calculate = async () => {
        if (!fromDate || !toDate) {
            message.error("Виберіть обидві дати");
            return;
        }

        setLoading(true);
        setResult(null);

        // Форматуємо дати у рядок YYYY-MM-DD для API
        const dateFromStr = fromDate.format('YYYY-MM-DD');
        const dateToStr = toDate.format('YYYY-MM-DD');

        try {
            // Робимо запит до нашого нового ендпоінту
            const response = await fetch(
                `${BASE_URL}/historical/compare?amount=${amount}&from_curr=${fromCurrency}&to_curr=${toCurrency}&date_from=${dateFromStr}&date_to=${dateToStr}`
            );

            if (!response.ok) {
                throw new Error("Дані за ці дати недоступні (спробуйте USD/EUR)");
            }

            const data = await response.json();
            setResult(data);

        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            title={
                <span>
          <CalculatorOutlined/> Исторический калькулятор
        </span>
            }
            style={{maxWidth: 600, margin: '20px auto', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}
        >
            {/* Вибір валют */}
            <div style={{marginBottom: 20}}>
                <Text strong>Валютная пара:</Text>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 8}}>
                    <Select
                        value={fromCurrency}
                        onChange={setFromCurrency}
                        style={{width: '45%'}}
                    >
                        {currencies.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                    <ArrowRightOutlined style={{color: '#999'}}/>
                    <Select
                        value={toCurrency}
                        onChange={setToCurrency}
                        style={{width: '45%'}}
                    >
                        {currencies.map(c => <Option key={c} value={c}>{c}</Option>)}
                    </Select>
                </div>
                {toCurrency === 'RUB' && (
                    <Text type="secondary" style={{fontSize: 12, color: 'orange'}}>
                        * Історія RUB може бути недоступна після 2022 року
                    </Text>
                )}
            </div>

            <div style={{marginBottom: 20}}>
                <Text strong>Сумма для расчета:</Text>
                <InputNumber
                    value={amount}
                    onChange={setAmount}
                    min={1}
                    style={{width: '100%', marginTop: 8}}
                    addonAfter={fromCurrency}
                />
            </div>

            <Row gutter={16}>
                <Col span={12}>
                    <div style={{marginBottom: 20}}>
                        <Text strong>Дата "тогда":</Text>
                        <DatePicker
                            style={{width: '100%', marginTop: 8}}
                            onChange={setFromDate}
                            placeholder="Прошлая дата"
                            format="DD.MM.YYYY"
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{marginBottom: 20}}>
                        <Text strong>Дата "сейчас":</Text>
                        <DatePicker
                            style={{width: '100%', marginTop: 8}}
                            onChange={setToDate}
                            placeholder="Текущая дата"
                            format="DD.MM.YYYY"
                        />
                    </div>
                </Col>
            </Row>

            <Button
                type="primary"
                onClick={calculate}
                style={{width: '100%', height: 40}}
                disabled={!fromDate || !toDate}
                loading={loading}
            >
                Рассчитать разницу
            </Button>

            {result && (
                <Alert
                    style={{marginTop: 24}}
                    message={
                        <div>
                            <Title level={4} style={{marginTop: 0}}>Результат:</Title>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}>
                                <span>{fromDate.format('DD.MM.YYYY')}:</span>
                                <strong>{result.old_result.toFixed(2)} {toCurrency}</strong>
                                <Text type="secondary">({result.old_rate})</Text>
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
                                <span>{toDate.format('DD.MM.YYYY')}:</span>
                                <strong>{result.new_result.toFixed(2)} {toCurrency}</strong>
                                <Text type="secondary">({result.new_rate})</Text>
                            </div>

                            <div style={{borderTop: '1px solid #f0f0f0', paddingTop: 12}}>
                                <Text>Разница:</Text>
                                <p style={{
                                    color: result.difference > 0 ? '#3f8600' : '#cf1322',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    margin: '4px 0 0 0'
                                }}>
                                    {result.difference > 0 ? '+' : ''}{result.difference.toFixed(2)} {toCurrency}
                                    <span style={{fontSize: '14px', marginLeft: 8}}>
                    ({result.difference > 0 ? '+' : ''}{result.percent_change.toFixed(2)}%)
                  </span>
                                </p>
                                <Text type="secondary" style={{fontSize: 12}}>
                                    {result.difference > 0
                                        ? "Вы бы выиграли, подождав"
                                        : "Выгоднее было менять раньше"}
                                </Text>
                            </div>
                        </div>
                    }
                    type={result.difference > 0 ? 'success' : 'error'} // Зелене, якщо сума виросла
                    showIcon
                />
            )}
        </Card>
    );
};

export default HistoricalCalculator;