// Функция для отображения модального окна
export const showPopup = (popupElement) => {
    popupElement.classList.add('popup_is-opened'); // делаем окно видимым
    document.addEventListener('keydown', handleEscapeClose); // слушаем Escape
};

// Функция для скрытия модального окна
export const hidePopup = (popupElement) => {
    popupElement.classList.remove('popup_is-opened'); // убираем класс видимости
    document.removeEventListener('keydown', handleEscapeClose); // удаляем слушатель
};

// Функция закрытия по клику на фон
export const overlayClickHandler = (event) => {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (event.target === openedPopup) {
        hidePopup(openedPopup);
    }
};

// Функция закрытия по клавише Escape
export const handleEscapeClose = (event) => {
    if (event.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            hidePopup(openedPopup);
        }
    }
};
