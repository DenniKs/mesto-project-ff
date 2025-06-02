// Настройки для работы с API
const API_SETTINGS = {
    URL: 'https://nomoreparties.co/v1/wff-cohort-39',
    HEADERS: {
        Authorization: '2b16940d-340a-4cb4-8e7c-62e0c2612983',
        'Content-Type': 'application/json'
    }
};

// Универсальная обработка ответа сервера
const processResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

// Проверка: является ли URL допустимой ссылкой на изображение
export const validateImageURL = (input) => {
    return fetch(input.value, { method: 'HEAD' })
        .then((res) => {
            if (!res.ok) {
                console.warn('Сервер вернул ошибку');
                return;
            }
            const type = res.headers.get('Content-Type') || '';
            if (!type.startsWith('image/')) {
                console.warn('Недопустимый формат: не изображение');
            }
        });
};

// Обновление аватара
export const changeAvatar = (avatarInput) => {
    return fetch(`${API_SETTINGS.URL}/users/me/avatar`, {
        method: 'PATCH',
        headers: API_SETTINGS.HEADERS,
        body: JSON.stringify({ avatar: avatarInput.value })
    }).then(processResponse);
};

// Обновление профиля пользователя
export const editProfile = (username, userInfo) => {
    return fetch(`${API_SETTINGS.URL}/users/me`, {
        method: 'PATCH',
        headers: API_SETTINGS.HEADERS,
        body: JSON.stringify({ name: username, about: userInfo })
    }).then(processResponse);
};

// Создание новой карточки
export const addCard = (title, imageUrl) => {
    return fetch(`${API_SETTINGS.URL}/cards`, {
        method: 'POST',
        headers: API_SETTINGS.HEADERS,
        body: JSON.stringify({ name: title, link: imageUrl })
    }).then(processResponse);
};

// Получение информации о текущем пользователе
export const fetchUserProfile = () => {
    return fetch(`${API_SETTINGS.URL}/users/me`, {
        headers: { Authorization: API_SETTINGS.HEADERS.Authorization }
    }).then(processResponse);
};

// Загрузка стартовых карточек
export const fetchInitialCards = () => {
    return fetch(`${API_SETTINGS.URL}/cards`, {
        headers: { Authorization: API_SETTINGS.HEADERS.Authorization }
    }).then(processResponse);
};

// Удаление карточки по ID
export const removeCard = (id) => {
    return fetch(`${API_SETTINGS.URL}/cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: API_SETTINGS.HEADERS.Authorization }
    }).then(processResponse);
};

// Управление лайком (добавить/удалить)
export const toggleLike = (cardId, isLiked) => {
    const method = isLiked ? 'DELETE' : 'PUT';
    return fetch(`${API_SETTINGS.URL}/cards/likes/${cardId}`, {
        method,
        headers: { Authorization: API_SETTINGS.HEADERS.Authorization }
    }).then(processResponse);
};
