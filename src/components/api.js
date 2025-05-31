// Конфигурация для запросов к серверу API
export const config = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-39', // базовый URL API
    headers: {
        authorization: '2b16940d-340a-4cb4-8e7c-62e0c2612983', // токен авторизации
        'Content-Type': 'application/json' // формат отправляемых данных
    }
};

// Обработчик ответа от сервера
export const handleResponse = (response) => {
    if (response.ok) {
        // Если ответ успешен — преобразуем его в JSON
        return response.json();
    }
    // Иначе — отклоняем промис с текстом ошибки
    return Promise.reject(`Ошибка: ${response.status}`);
};

// Проверка доступности и корректности URL изображения
export const updatePhotoCheck = (url) => {
    return fetch(`${url.value}`, {
        method: 'HEAD', // получаем только заголовки
    })
        .then(response => {
            if (!response.ok) {
                console.log('Произошла ошибка'); // если статус ответа не 2xx
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType.startsWith('image/')) {
                console.log('URL не является картинкой'); // если тип содержимого не изображение
            }
        })
};

// Обновление аватара пользователя
export const updatePhoto = (newAvatarPhoto) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
        method: 'PATCH', // метод обновления данных
        headers: {
            authorization: `${config.headers.authorization}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            avatar: `${newAvatarPhoto.value}` // передаём новый URL аватара
        })
    })
        .then(handleResponse);
};

// Обновление информации о пользователе (имя и описание)
export const updateProfile = (nameData, aboutData,) => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'PATCH',
        headers: {
            authorization: `${config.headers.authorization}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nameData, // новое имя
            about: aboutData, // новое описание
        })
    })
        .then(handleResponse);
};

// Добавление новой карточки (места)
export const addCard = (nameCard, linkCard) => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'POST',
        headers: {
            authorization: `${config.headers.authorization}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: nameCard, // название карточки
            link: linkCard, // ссылка на изображение
        })
    })
        .then(handleResponse);
};

// Получение данных текущего пользователя
export const getUserData = () => {
    return fetch(`${config.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
            authorization: `${config.headers.authorization}`,
        }
    })
        .then(handleResponse);
};

// Получение начального набора карточек
export const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
        method: 'GET',
        headers: {
            authorization: `${config.headers.authorization}`,
        }
    })
        .then(handleResponse);
};

// Удаление карточки по ID
export const deleteCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
            authorization: `${config.headers.authorization}`,
        }
    })
        .then(handleResponse);
};

// Установка или снятие лайка с карточки
export const addLike = (cardId, currentLike) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
        method: currentLike ? 'DELETE' : 'PUT', // если лайк уже стоит — удаляем, иначе — добавляем
        headers: {
            authorization: `${config.headers.authorization}`,
        }
    })
        .then(handleResponse);
};
