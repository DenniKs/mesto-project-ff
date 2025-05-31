import { openModal } from "./modal";

/**
 * Создаёт DOM-элемент карточки на основе переданных данных.
 * 
 * @param {Object} cardData - Данные карточки (название, ссылка, лайки, владелец и т.д.)
 * @param {Function} handleDeleteCard - Функция для удаления карточки с сервера
 * @param {Function} handleLikeToggle - Функция для добавления/удаления лайка
 * @param {string} currentUserId - ID текущего пользователя
 * @param {Function} openImagePopup - Функция для открытия попапа с изображением
 * @returns {HTMLElement} - DOM-элемент карточки
 */
export function createCard(cardData, handleDeleteCard, handleLikeToggle, currentUserId, openImagePopup) {
    // Получаем шаблон карточки из DOM и клонируем его содержимое
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

    // Получаем элементы внутри карточки
    const likeButton = cardElement.querySelector('.card__like-button');
    const cardImage = cardElement.querySelector('.card__image');
    const likeCounter = cardElement.querySelector('.card__count');
    const cardTitle = cardElement.querySelector('.card__title');
    const deletePopup = cardElement.querySelector('.popup_type_trash');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const confirmDeleteButton = cardElement.querySelector('.popup__button');

    // Устанавливаем текст заголовка и количество лайков
    likeCounter.textContent = cardData.likes ? cardData.likes.length : 0;
    cardTitle.textContent = cardData.name;

    // Проверяем, лайкнул ли пользователь эту карточку
    const isLikedByUser = cardData.likes.some(like => like._id === currentUserId);
    if (isLikedByUser) {
        likeButton.classList.add('card__like-button_is-active');
    }

    // Обработчик клика по кнопке лайка
    likeButton.addEventListener('click', () => {
        const hasUserLiked = likeButton.classList.contains('card__like-button_is-active');

        // Вызываем функцию для добавления/удаления лайка на сервере
        handleLikeToggle(cardData._id, hasUserLiked)
            .then((updatedCard) => {
                // Обновляем состояние кнопки и счётчик лайков
                likeButton.classList.toggle('card__like-button_is-active');
                likeCounter.textContent = updatedCard.likes.length;
            })
            .catch((error) => {
                console.error('Ошибка при установке лайка:', error);
            });
    });

    // Проверяем, является ли пользователь владельцем карточки
    if (currentUserId !== cardData.owner._id) {
        // Если нет — убираем кнопку удаления
        deleteButton.remove();
    } else {
        // Если да — добавляем обработчики на удаление
        deleteButton.addEventListener('click', () => {
            // Открываем попап подтверждения удаления
            openModal(deletePopup);
        });

        confirmDeleteButton.addEventListener('click', () => {
            // Удаляем карточку на сервере, затем из DOM
            handleDeleteCard(cardData._id)
                .then(() => {
                    cardElement.remove();
                })
                .catch((error) => {
                    console.error('Ошибка при удалении карточки:', error);
                });
        });
    }

    // Открытие попапа при клике на изображение
    cardImage.addEventListener('click', () => {
        openImagePopup(cardData.link, cardData.name);
    });

    // Устанавливаем ссылку и alt для изображения
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;

    // Возвращаем готовую карточку
    return cardElement;
}
