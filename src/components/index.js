import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, addLike } from './card.js';
import { openModal, closeModal, closeModalOverlay } from './modal.js';

const buttonEditProfile = document.querySelector('.profile__edit-button');
const popupEditProfile = document.querySelector('.popup_type_edit');
const buttonAddCard = document.querySelector('.profile__add-button');
const popupAddCard = document.querySelector('.popup_type_new-card');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');
const nameTitle = document.querySelector('.profile__title');
const jobTitle = document.querySelector('.profile__description');
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const popupImage = document.querySelector('.popup__image');
const popupImageOpen = document.querySelector('.popup_type_image');
const popupImageDescription = document.querySelector('.popup__caption');
const cardContainer = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');

// Добавление карточек
initialCards.forEach(function (item) {
    const newCard = createCard(item, deleteCard, addLike, openPopupImage);
    cardContainer.append(newCard);
});

// Обработчик открытия попапа добавления карточки
buttonAddCard.addEventListener('click', () => openModal(popupAddCard));

// Обработчик открытия попапа редактирования профиля
buttonEditProfile.addEventListener('click', function () {
    nameInput.value = nameTitle.textContent;
    jobInput.value = jobTitle.textContent;
    openModal(popupEditProfile);
});

// Обработчик отправки формы редактирования профиля
formEditProfile.addEventListener('submit', function (evt) {
    evt.preventDefault();
    nameTitle.textContent = nameInput.value;
    jobTitle.textContent = jobInput.value;
    closeModal(popupEditProfile);
});

// Обработчик отправки формы добавления новой карточки
formAddCard.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const item = {
        link: document.querySelector('.popup__input_type_url').value,
        name: document.querySelector('.popup__input_type_card-name').value
    };
    const newCard = createCard(item, deleteCard, addLike, openPopupImage);
    cardContainer.prepend(newCard);
    formAddCard.reset();
    closeModal(popupAddCard);
});

// Функция открытия попапа с изображением
function openPopupImage(imageSrc, imageAlt) {
    popupImage.src = imageSrc;
    popupImage.alt = imageAlt;
    popupImageDescription.textContent = imageAlt;
    openModal(popupImageOpen);
}

// Добавление обработчиков закрытия попапов по крестику и оверлею
popups.forEach(popup => {
    const closeButton = popup.querySelector('.popup__close');
    closeButton.addEventListener('click', () => closeModal(popup));
    popup.addEventListener('click', closeModalOverlay);
});
