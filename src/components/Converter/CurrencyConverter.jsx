import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Select, Button, Space, Typography, Alert, Tag, message } from 'antd';
import { SwapOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { convertCurrency, getAvailableCurrencies } from '../../services/currencyApi';

const { Option } = Select;
const { Title, Text } = Typography;

const BASE_URL = 'http://127.0.0.1:8000';

const CurrencyConverter = ({ onSuccess, initialPair }) => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('RUB');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currencies, setCurrencies] = useState([]);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {

        setCurrencies(getAvailableCurrencies());
    }, []);

    useEffect(() => {
        if (initialPair) {
            setFromCurrency(initialPair.from);
            setToCurrency(initialPair.to);

            setResult(null);
        }
    }, [initialPair]);

    const fetchFavorites = async () => {
        if (!token) return;

        try {
            const response = await fetch(`${BASE_URL}/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();

                const formatted = data.map(item => ({
                    from: item.from_currency,
                    to: item.to_currency,
                    label: item.label
                }));
                setFavorites(formatted);
            }
        } catch (err) {
            console.error("Ошибка загрузки избранного:", err);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [token]);


    useEffect(() => {
        const isFav = favorites.some(fav => fav.from === fromCurrency && fav.to === toCurrency);
        setIsFavorite(isFav);
    }, [fromCurrency, toCurrency, favorites]);


    const handleConvert = async () => {
        if (!amount || amount <= 0) {
            setError('Введите сумму больше нуля');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const conversionData = await convertCurrency(amount, fromCurrency, toCurrency);
            setResult(conversionData);


            if (token) {
                await fetch(`${BASE_URL}/history`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(conversionData)
                });


                if (onSuccess) {
                    onSuccess();
                }
            }

        } catch (err) {
            setError(`Ошибка: ${err.message}`);
            setResult(null);
        } finally {
            setLoading(false);
        }
    };


    const handleFavoriteToggle = async () => {
        if (!token) {
            message.warning("Войдите, чтобы добавлять в избранное");
            return;
        }

        try {
            if (isFavorite) {

                await fetch(`${BASE_URL}/favorites/${fromCurrency}/${toCurrency}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                message.success("Удалено из избранного");
            } else {

                await fetch(`${BASE_URL}/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        from_currency: fromCurrency,
                        to_currency: toCurrency,
                        label: `${fromCurrency} → ${toCurrency}`
                    })
                });
                message.success("Добавлено в избранное");
            }

            fetchFavorites();
        } catch (err) {
            message.error("Ошибка обновления избранного");
        }
    };

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult(null);
    };

    const handleQuickSelect = (from, to) => {
        setFromCurrency(from);
        setToCurrency(to);
        setResult(null);
    };

    return (
        <Card
            style={{ borderRadius: 16, border: 'none', boxShadow: 'none' }}
        >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>


                {favorites.length > 0 && (
                    <div>
                        <Text strong style={{ marginBottom: 8, display: 'block' }}>Избранные пары:</Text>
                        <Space wrap>
                            {favorites.map((fav, index) => (
                                <Tag
                                    key={index}
                                    color="blue"
                                    style={{ cursor: 'pointer', padding: '4px 8px' }}
                                    onClick={() => handleQuickSelect(fav.from, fav.to)}
                                >
                                    {fav.label}
                                </Tag>
                            ))}
                        </Space>
                    </div>
                )}


                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end' }}>
                    <div>
                        <Text strong>Сумма:</Text>
                        <InputNumber
                            size="large"
                            value={amount}
                            onChange={setAmount}
                            min={0.01}
                            step={0.01}
                            style={{ width: '100%', marginTop: 8 }}
                        />
                    </div>

                    <Button
                        type="text"
                        icon={<SwapOutlined />}
                        onClick={swapCurrencies}
                        style={{ alignSelf: 'center' }}
                    />

                    <div>
                        <Text strong>Из валюты:</Text>
                        <Select
                            size="large"
                            value={fromCurrency}
                            onChange={setFromCurrency}
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            {currencies.map(currency => (
                                <Option key={currency} value={currency}>{currency}</Option>
                            ))}
                        </Select>
                    </div>


                    <div style={{ textAlign: 'center', display: 'none' }}>
                        <span>→</span>
                    </div>

                    <div>
                        <Text strong>В валюту:</Text>
                        <Select
                            size="large"
                            value={toCurrency}
                            onChange={setToCurrency}
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            {currencies.map(currency => (
                                <Option key={currency} value={currency}>{currency}</Option>
                            ))}
                        </Select>
                    </div>
                </div>


                <Button
                    type="primary"
                    size="large"
                    onClick={handleConvert}
                    loading={loading}
                    style={{ width: '100%' }}
                >
                    Конвертировать
                </Button>


                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                    />
                )}


                {result && (
                    <Card
                        type="inner"
                        style={{
                            background: '#f6ffed',
                            borderColor: '#b7eb8f',
                            textAlign: 'center'
                        }}
                    >
                        <Title level={2} style={{ margin: 0 }}>
                            {amount} {fromCurrency} = {result.result.toFixed(2)} {toCurrency}
                        </Title>

                        <Space direction="vertical" size="small" style={{ marginTop: 16, width: '100%' }}>
                            <Text type="secondary">
                                Курс: 1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
                            </Text>

                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Источник: {result.source || 'Server'}
                            </Text>

                            <Space>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={() => {
                                        const text = `${amount} ${fromCurrency} = ${result.result.toFixed(2)} ${toCurrency}`;
                                        navigator.clipboard.writeText(text);
                                        message.success('Скопировано!');
                                    }}
                                >
                                    Копировать
                                </Button>

                                <Button
                                    type="link"
                                    size="small"
                                    icon={isFavorite ? <StarFilled /> : <StarOutlined />}
                                    onClick={handleFavoriteToggle}
                                >
                                    {isFavorite ? 'В избранном' : 'В избранное'}
                                </Button>
                            </Space>
                        </Space>
                    </Card>
                )}
            </Space>
        </Card>
    );
};

export default CurrencyConverter;