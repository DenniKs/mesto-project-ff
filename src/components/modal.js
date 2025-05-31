// Открывает модальное окно
export function openModal(currentModal) {
    currentModal.classList.add('popup_is-opened'); // добавляет класс, делающий модалку видимой
    document.addEventListener('keydown', closeModalEscape); // добавляет слушатель для закрытия по клавише Escape
};

// Закрывает модальное окно
export function closeModal(currentModal) {
    currentModal.classList.remove('popup_is-opened'); // удаляет класс, скрывающий модалку
    document.removeEventListener('keydown', closeModalEscape); // удаляет обработчик клавиши Escape
};

// Закрывает модальное окно по клику на оверлей (область вне содержимого модалки)
export function closeModalOverlay(evt) {
    const currentModal = document.querySelector('.popup_is-opened'); // находим текущее открытое модальное окно
    if (evt.target === currentModal) { // если клик был именно по оверлею (а не по внутреннему контенту)
        closeModal(currentModal); // закрываем модалку
    }
};

// Закрывает модальное окно при нажатии клавиши Escape
export function closeModalEscape(evt) {
    if (evt.key === 'Escape') { // проверка на нажатие клавиши Escape
        const currentModal = document.querySelector('.popup_is-opened'); // находим текущее открытое модальное окно
        if (currentModal) {
            closeModal(currentModal); // закрываем его
        }
    }
};
