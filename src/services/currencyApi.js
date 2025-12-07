const BASE_URL = 'http://127.0.0.1:8000';


const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.85,
  RUB: 92.5,
  GBP: 0.73,
  JPY: 110.5,
  CNY: 6.45,
};


export const fetchExchangeRates = async (baseCurrency = 'USD') => {
    try {

        const response = await fetch(`${BASE_URL}/rates/${baseCurrency}`);
        if (!response.ok) {
            throw new Error('Не удалось получить курсы');
        }
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Ошибка получения курсов:', error);
        return {};
    }
};

export const convertCurrency = async (amount, from, to) => {
    try {

        const response = await fetch(`${BASE_URL}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                amount: amount,
                from_currency: from,
                to_currency: to,
            }),
        });

        if (!response.ok) {
            throw new Error('Ошибка конвертации');
        }

        return await response.json();
    } catch (error) {
        console.error('Ошибка конвертации:', error);
        throw error;
    }
};


export const getAvailableCurrencies = () => {
    return ["USD", "EUR", "RUB", "GBP", "JPY", "CNY"];
};