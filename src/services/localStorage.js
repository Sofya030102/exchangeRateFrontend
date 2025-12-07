const HISTORY_KEY = 'currency_converter_history';
const FAVORITES_KEY = 'currency_favorites';
const USER_KEY = 'currency_user';


export const saveToHistory = (conversion) => {
  const history = getHistory();
  const newEntry = {
    id: Date.now(),
    ...conversion,
    savedAt: new Date().toISOString()
  };
  
  const updatedHistory = [newEntry, ...history].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return newEntry;
};

export const getHistory = () => {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const deleteHistoryItem = (id) => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};


export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [
    { from: 'USD', to: 'RUB', label: 'USD → RUB' },
    { from: 'EUR', to: 'RUB', label: 'EUR → RUB' },
  ];
};

export const addToFavorites = (from, to, label) => {
  const favorites = getFavorites();
  const newFavorite = { from, to, label: label || `${from} → ${to}` };
  
  if (!favorites.some(fav => fav.from === from && fav.to === to)) {
    favorites.push(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (from, to) => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(fav => !(fav.from === from && fav.to === to));
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};


export const saveUser = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
};