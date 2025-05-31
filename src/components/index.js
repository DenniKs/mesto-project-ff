import '../pages/index.css';
import { createCard } from './card.js';
import { openModal, closeModal, closeModalOverlay } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
    config,
    updatePhotoCheck,
    updatePhoto,
    updateProfile,
    addCard,
    getUserData,
    getInitialCards,
    deleteCard,
    addLike
} from './api.js';

// Кнопки и элементы модальных окон
const editProfileButton = document.querySelector('.profile__edit-button');
const editProfilePopup = document.querySelector('.popup_type_edit');
const addCardButton = document.querySelector('.profile__add-button');
const addCardPopup = document.querySelector('.popup_type_new-card');
const editAvatarPopup = document.querySelector('.popup_type_new_avatar');
const profileAvatar = document.querySelector('.profile__image');

// Поля формы редактирования профиля
const nameInputField = document.querySelector('.popup__input_type_name');
const descriptionInputField = document.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');

// Форма добавления карточки
const addCardForm = document.querySelector('.popup__form[name="new-place"]');

// Модальное окно с изображением
const imagePopup = document.querySelector('.popup_type_image');
const imagePopupImage = document.querySelector('.popup__image');
const imagePopupCaption = document.querySelector('.popup__caption');

// Список карточек
const cardsContainer = document.querySelector('.places__list');

// Форма смены аватара
const avatarForm = document.querySelector('.popup__form[name="new-avatar"]');
const avatarInput = document.querySelector('.popup__input_type_avatar');

// Конфигурация валидации
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
};

// Открытие попапа смены аватара
profileAvatar.addEventListener('click', () => {
    clearValidation(avatarForm, validationConfig);
    openModal(editAvatarPopup);
});

// Открытие попапа добавления карточки
addCardButton.addEventListener('click', () => {
    clearValidation(addCardForm, validationConfig);
    openModal(addCardPopup);
});

// Открытие попапа редактирования профиля
editProfileButton.addEventListener('click', () => {
    clearValidation(editProfileForm, validationConfig);
    nameInputField.value = profileName.textContent;
    descriptionInputField.value = profileDescription.textContent;
    openModal(editProfilePopup);
});

// Закрытие попапа при нажатии на кнопку закрытия
document.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup__close')) {
        const popupToClose = evt.target.closest('.popup');
        closeModal(popupToClose);
    }
});

// Открытие изображения в полноэкранном режиме
function openImagePopup(imageSrc, imageAlt) {
    imagePopupImage.src = imageSrc;
    imagePopupImage.alt = imageAlt;
    imagePopupCaption.textContent = imageAlt;
    openModal(imagePopup);
}

// Закрытие попапа при клике по оверлею
document.addEventListener('click', closeModalOverlay);

// Активация валидации всех форм
enableValidation(validationConfig);

// Обработка отправки формы смены аватара
avatarForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const submitButton = avatarForm.querySelector('.popup__button');
    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    updatePhotoCheck(avatarInput)
        .catch((error) => {
            console.log('Ошибка при проверке ссылки на аватар:', error);
        });

    updatePhoto(avatarInput)
        .then((data) => {
            profileAvatar.style.backgroundImage = `url(${data.avatar})`;
        })
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
            closeModal(editAvatarPopup);
        })
        .catch((error) => {
            console.log('Ошибка при обновлении аватара:', error);
        });
});

// Обработка отправки формы редактирования профиля
editProfileForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    profileName.textContent = nameInputField.value;
    profileDescription.textContent = descriptionInputField.value;

    const submitButton = editProfileForm.querySelector('.popup__button');
    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    updateProfile(nameInputField.value, descriptionInputField.value)
        .then((data) => {
            profileName.textContent = data.name;
            profileDescription.textContent = data.about;
        })
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
            closeModal(editProfilePopup);
        })
        .catch((error) => {
            console.log('Ошибка при обновлении профиля:', error);
        });
});

// Обработка отправки формы добавления карточки
addCardForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const submitButton = addCardForm.querySelector('.popup__button');
    const cardName = document.querySelector('.popup__input_type_card-name').value;
    const cardLink = document.querySelector('.popup__input_type_url').value;

    submitButton.textContent = "Сохранение...";
    submitButton.disabled = true;

    addCard(cardName, cardLink)
        .then((cardData) => {
            const newCard = createCard(cardData, deleteCard, addLike, cardData.owner._id, openImagePopup);
            cardsContainer.prepend(newCard);
        })
        .finally(() => {
            submitButton.textContent = "Сохранить";
            submitButton.disabled = false;
            addCardForm.reset();
            closeModal(addCardPopup);
        })
        .catch((error) => {
            console.log('Ошибка при добавлении карточки:', error);
        });
});

// Загрузка данных пользователя и карточек при инициализации
Promise.all([getUserData(), getInitialCards()])
    .then(([userData, initialCards]) => {
        profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
        profileName.textContent = userData.name;
        profileDescription.textContent = userData.about;
        const userId = userData._id;

        initialCards.forEach((card) => {
            const newCard = createCard(card, deleteCard, addLike, userId, openImagePopup);
            cardsContainer.append(newCard);
        });
    })
    .catch((error) => {
        console.log('Ошибка при загрузке данных:', error);
    });
