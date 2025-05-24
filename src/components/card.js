// Функция для создания новой карточки на основе шаблона
// card — объект с данными карточки (name и link)
// deleteCard — обработчик удаления карточки
// addLike — обработчик лайка
// openPopupImage — функция открытия попапа с изображением
export function createCard(card, deleteCard, addLike, openPopupImage) {
    const template = document.querySelector('#card-template').content;
    const cardElement = template.querySelector('.card').cloneNode(true);

    const imageElement = cardElement.querySelector('.card__image');
    const titleElement = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    titleElement.textContent = card.name;
    imageElement.src = card.link;
    imageElement.alt = card.name;

    // Назначаем обработчики событий для кнопок и изображения
    deleteButton.addEventListener('click', deleteCard);
    likeButton.addEventListener('click', addLike);
    imageElement.addEventListener('click', () => openPopupImage(card.link, card.name));

    return cardElement;
}

// Функция-обработчик удаления карточки из DOM
export function deleteCard(evt) {
    const cardElement = evt.target.closest('.card');
    cardElement.remove();
}

// Функция-обработчик постановки и снятия лайка
export function addLike(evt) {
    const likeButton = evt.target;
    if (likeButton.classList.contains('card__like-button')) {
        likeButton.classList.toggle('card__like-button_is-active');
    }
}
