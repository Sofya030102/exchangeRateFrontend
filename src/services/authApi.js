
const BASE_URL = 'http://127.0.0.1:8000';

export const loginUser = async (email, password) => {

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/token`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка входа');
    }

    return await response.json();
};

export const registerUser = async (email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка регистрации');
    }

    return await response.json();
};