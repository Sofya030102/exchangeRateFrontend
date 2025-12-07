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
        // GET запит до нашого бекенду
        const response = await fetch(`${BASE_URL}/rates/${baseCurrency}`);
        if (!response.ok) {
            throw new Error('Не вдалося отримати курси');
        }
        const data = await response.json();
        return data.rates;
    } catch (error) {
        console.error('Помилка отримання курсів:', error);
        return {};
    }
};

export const convertCurrency = async (amount, from, to) => {
    try {
        // POST запит для розрахунку
        const response = await fetch(`${BASE_URL}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Перетворюємо об'єкт у рядок JSON
            body: JSON.stringify({
                amount: amount,
                from_currency: from, // Важливо: узгоджуємо назви з Pydantic-моделлю на сервері
                to_currency: to,
            }),
        });

        if (!response.ok) {
            throw new Error('Помилка конвертації');
        }

        return await response.json();
    } catch (error) {
        console.error('Помилка конвертації:', error);
        throw error;
    }
};

// Список валют, які підтримує наш бекенд (FALLBACK_RATES)
export const getAvailableCurrencies = () => {
    return ["USD", "EUR", "RUB", "GBP", "JPY", "CNY"];
};