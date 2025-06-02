import '../pages/index.css';
import { createCard } from './card.js';
import { showPopup, hidePopup, overlayClickHandler } from './modal.js';
import { initFormValidation, resetValidationState } from './validation.js';
import {
    validateImageURL,
    changeAvatar,
    editProfile,
    addCard,
    fetchUserProfile,
    fetchInitialCards,
    removeCard,
    toggleLike
} from './api.js';

// DOM-элементы
const btnEdit = document.querySelector('.profile__edit-button');
const btnAdd = document.querySelector('.profile__add-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const popupAddCard = document.querySelector('.popup_type_new-card');
const popupEditAvatar = document.querySelector('.popup_type_new_avatar');
const avatarElement = document.querySelector('.profile__image');

const inputName = document.querySelector('.popup__input_type_name');
const inputDesc = document.querySelector('.popup__input_type_description');
const displayName = document.querySelector('.profile__title');
const displayDesc = document.querySelector('.profile__description');
const formProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formCard = document.querySelector('.popup__form[name="new-place"]');
const formAvatar = document.querySelector('.popup__form[name="new-avatar"]');
const inputAvatar = document.querySelector('.popup__input_type_avatar');

const popupImage = document.querySelector('.popup_type_image');
const popupImg = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');

const cardList = document.querySelector('.places__list');

const validationSettings = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
};

// Открытие попапов
btnEdit.addEventListener('click', () => {
    resetValidationState(formProfile, validationSettings);
    inputName.value = displayName.textContent;
    inputDesc.value = displayDesc.textContent;
    showPopup(popupEditProfile);
});

btnAdd.addEventListener('click', () => {
    resetValidationState(formCard, validationSettings);
    showPopup(popupAddCard);
});

avatarElement.addEventListener('click', () => {
    resetValidationState(formAvatar, validationSettings);
    showPopup(popupEditAvatar);
});

// Закрытие по кнопке
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup__close')) {
        hidePopup(e.target.closest('.popup'));
    }
});

// Открытие полноэкранного изображения
function previewImage(link, title) {
    popupImg.src = link;
    popupImg.alt = title;
    popupCaption.textContent = title;
    showPopup(popupImage);
}

document.addEventListener('click', overlayClickHandler);
initFormValidation(validationSettings);

// Отправка формы смены аватара
formAvatar.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = formAvatar.querySelector('.popup__button');
    btn.textContent = 'Сохранение...';
    btn.disabled = true;

    validateImageURL(inputAvatar)
        .catch(err => console.error('Ошибка валидации аватара:', err));

    changeAvatar(inputAvatar)
        .then(data => {
            avatarElement.style.backgroundImage = `url(${data.avatar})`;
        })
        .finally(() => {
            btn.textContent = 'Сохранить';
            btn.disabled = false;
            hidePopup(popupEditAvatar);
        })
        .catch(err => console.error('Ошибка обновления аватара:', err));
});

// Отправка формы профиля
formProfile.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = formProfile.querySelector('.popup__button');
    btn.textContent = 'Сохранение...';
    btn.disabled = true;

    displayName.textContent = inputName.value;
    displayDesc.textContent = inputDesc.value;

    editProfile(inputName.value, inputDesc.value)
        .then(data => {
            displayName.textContent = data.name;
            displayDesc.textContent = data.about;
        })
        .finally(() => {
            btn.textContent = 'Сохранить';
            btn.disabled = false;
            hidePopup(popupEditProfile);
        })
        .catch(err => console.error('Ошибка обновления профиля:', err));
});

// Отправка формы карточки
formCard.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = formCard.querySelector('.popup__button');
    const name = formCard.querySelector('.popup__input_type_card-name').value;
    const link = formCard.querySelector('.popup__input_type_url').value;

    btn.textContent = 'Сохранение...';
    btn.disabled = true;

    addCard(name, link)
        .then(card => {
            const cardEl = createCard(card, removeCard, toggleLike, card.owner._id, previewImage);
            cardList.prepend(cardEl);
        })
        .finally(() => {
            btn.textContent = 'Сохранить';
            btn.disabled = false;
            formCard.reset();
            hidePopup(popupAddCard);
        })
        .catch(err => console.error('Ошибка добавления карточки:', err));
});

// Загрузка начальных данных
Promise.all([fetchUserProfile(), fetchInitialCards()])
    .then(([user, cards]) => {
        avatarElement.style.backgroundImage = `url(${user.avatar})`;
        displayName.textContent = user.name;
        displayDesc.textContent = user.about;
        const currentUserId = user._id;

        cards.forEach(card => {
            const item = createCard(card, removeCard, toggleLike, currentUserId, previewImage);
            cardList.append(item);
        });
    })
    .catch(err => console.error('Ошибка загрузки данных:', err));
