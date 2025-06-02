import { showPopup } from './modal';

/**
 * Проверяет, содержит ли элемент указанный CSS-класс.
 *
 * @param {Element} element - DOM-элемент, у которого проверяется наличие класса.
 * @param {string} className - Имя класса, которое нужно проверить.
 * @returns {boolean} - true, если элемент содержит класс, иначе false.
 */
function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Создаёт DOM-элемент карточки на основе переданных данных.
 *
 * @param {Object} data - Данные карточки: имя, ссылка, лайки, владелец.
 * @param {Function} onDelete - Функция для удаления карточки с сервера.
 * @param {Function} onLikeToggle - Функция для добавления/удаления лайка.
 * @param {string} userId - ID текущего пользователя.
 * @param {Function} onImageClick - Функция открытия попапа с изображением.
 * @returns {HTMLElement} - Созданный элемент карточки.
 */
export function createCard(data, onDelete, onLikeToggle, userId, onImageClick) {
    // Получаем шаблон карточки и клонируем его содержимое
    const template = document.querySelector('#card-template').content;
    const cardNode = template.querySelector('.card').cloneNode(true);

    // Находим нужные элементы внутри карточки
    const btnLike = cardNode.querySelector('.card__like-button');
    const imgElement = cardNode.querySelector('.card__image');
    const likeCount = cardNode.querySelector('.card__count');
    const titleElement = cardNode.querySelector('.card__title');
    const btnDelete = cardNode.querySelector('.card__delete-button');
    const popupTrash = cardNode.querySelector('.popup_type_trash');
    const confirmDelete = cardNode.querySelector('.popup__button');

    // Устанавливаем данные карточки
    titleElement.textContent = data.name;
    likeCount.textContent = data.likes?.length ?? 0;

    // Отмечаем лайк, если текущий пользователь уже лайкал карточку
    const liked = data.likes.some(likeObj => likeObj._id === userId);
    if (liked) {
        btnLike.classList.add('card__like-button_is-active');
    }

    // Обработчик клика по кнопке лайка
    btnLike.addEventListener('click', () => {
        const alreadyLiked = hasClass(btnLike, 'card__like-button_is-active');

        // Отправляем запрос на сервер для установки/снятия лайка
        onLikeToggle(data._id, alreadyLiked)
            .then((updated) => {
                btnLike.classList.toggle('card__like-button_is-active'); // переключаем состояние кнопки
                likeCount.textContent = updated.likes.length; // обновляем количество лайков
            })
            .catch(err => {
                console.error('Не удалось обновить лайк:', err);
            });
    });

    // Проверяем, является ли пользователь владельцем карточки
    const isOwner = data.owner._id === userId;
    if (!isOwner) {
        // Если не владелец — удаляем кнопку удаления
        btnDelete.remove();
    } else {
        // Если владелец — добавляем обработчики удаления карточки
        btnDelete.addEventListener('click', () => {
            showPopup(popupTrash); // открываем попап подтверждения
        });

        confirmDelete.addEventListener('click', () => {
            onDelete(data._id)
                .then(() => {
                    cardNode.remove(); // удаляем карточку из DOM
                })
                .catch(err => {
                    console.error('Ошибка при удалении:', err);
                });
        });
    }

    // Устанавливаем изображение и его описание
    imgElement.src = data.link;
    imgElement.alt = data.name;

    // Открытие изображения в попапе при клике
    imgElement.addEventListener('click', () => {
        onImageClick(data.link, data.name);
    });

    // Возвращаем готовый DOM-элемент карточки
    return cardNode;
}
