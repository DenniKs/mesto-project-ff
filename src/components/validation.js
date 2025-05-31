// Проверка валидности одного инпута
export const isValid = (formElement, inputElement, configValidation) => {
    // Установка кастомного сообщения об ошибке при несоответствии шаблону
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage); // берем сообщение из data-атрибута
    } else {
        inputElement.setCustomValidity(""); // сброс кастомного сообщения
    }

    // Отображаем ошибку, если поле невалидно, иначе скрываем
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, configValidation);
    } else {
        hideInputError(formElement, inputElement, configValidation);
    }
};

// Отображает сообщение об ошибке под инпутом
export const showInputError = (formElement, inputElement, errorMessage, configValidation) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`); // элемент с текстом ошибки
    inputElement.classList.add(configValidation.errorClass); // добавляем класс, стилизующий невалидный инпут
    errorElement.textContent = errorMessage; // вставляем текст ошибки
    errorElement.classList.add(configValidation.inputErrorClass); // отображаем ошибку
};

// Скрывает сообщение об ошибке
export const hideInputError = (formElement, inputElement, configValidation) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(configValidation.errorClass); // удаляем класс ошибки с инпута
    errorElement.textContent = ''; // очищаем текст ошибки
    errorElement.classList.remove(configValidation.inputErrorClass); // скрываем элемент ошибки
};

// Деактивирует кнопку сабмита
const disableSubmitButton = (button, config) => {
    button.disabled = true; // блокируем кнопку
    button.classList.add(config.inactiveButtonClass); // добавляем класс неактивности
};

// Активирует кнопку сабмита
const enableSubmitButton = (button, config) => {
    button.disabled = false;
    button.classList.remove(config.inactiveButtonClass); // убираем класс неактивности
};

// Проверка, есть ли среди всех инпутов невалидные
export const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    });
};

// Управление состоянием кнопки отправки формы
export const toggleButtonState = (inputList, buttonElement, configValidation) => {
    if (hasInvalidInput(inputList)) {
        disableSubmitButton(buttonElement, configValidation); // если есть ошибки — выключаем кнопку
    } else {
        enableSubmitButton(buttonElement, configValidation); // иначе — включаем
    }
};

// Устанавливает обработчики на поля формы и кнопку
export const setEventListeners = (formElement, configValidation) => {
    const inputList = Array.from(formElement.querySelectorAll(configValidation.inputSelector)); // список инпутов
    const buttonElement = formElement.querySelector(configValidation.submitButtonSelector); // кнопка отправки

    toggleButtonState(inputList, buttonElement, configValidation); // начальное состояние кнопки

    // На каждый инпут — обработчик ввода
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            isValid(formElement, inputElement, configValidation); // проверка конкретного инпута
            toggleButtonState(inputList, buttonElement, configValidation); // обновление состояния кнопки
        });
    });
};

// Инициализация валидации для всех форм на странице
export const enableValidation = (configValidation) => {
    const formList = Array.from(document.querySelectorAll(configValidation.formSelector)); // все формы
    formList.forEach((formElement) => {
        setEventListeners(formElement, configValidation); // подключаем обработчики
    });
};

// Очищает ошибки и блокирует кнопку при открытии формы
export function clearValidation(formElement, configValidation) {
    const inputList = Array.from(formElement.querySelectorAll(configValidation.inputSelector)); // инпуты формы
    const buttonElement = formElement.querySelector(configValidation.submitButtonSelector); // кнопка отправки

    // Скрываем все ошибки
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, configValidation);
    });

    // Деактивируем кнопку отправки
    disableSubmitButton(buttonElement, configValidation);
};
