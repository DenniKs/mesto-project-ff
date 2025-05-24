// Функция открытия модального окна (попапа)
// currentModal — DOM-элемент открываемого попапа
export function openModal(currentModal) {
    currentModal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalEscape);
};

// Функция закрытия модального окна (попапа)
// currentModal — DOM-элемент закрываемого попапа
export function closeModal(currentModal) {
    currentModal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeModalEscape);
};

// Функция для закрытия попапа при клике по оверлею (фону вокруг содержимого)
export function closeModalOverlay(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

// Функция закрытия попапа при нажатии клавиши Escape
export function closeModalEscape(evt) {
    if (evt.key === 'Escape') {
        const currentModal = document.querySelector('.popup_is-opened');
        if (currentModal) {
            closeModal(currentModal);
        }
    }
};
