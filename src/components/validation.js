// Проверка валидности одного поля формы
export const validateInput = (form, input, config) => {
    if (input.validity.patternMismatch) {
        input.setCustomValidity(input.dataset.errorMessage || '');
    } else {
        input.setCustomValidity('');
    }

    if (!input.validity.valid) {
        displayError(form, input, input.validationMessage, config);
    } else {
        removeError(form, input, config);
    }
};

// Показывает сообщение об ошибке
export const displayError = (form, input, message, config) => {
    const errorText = form.querySelector(`.${input.id}-error`);
    input.classList.add(config.errorClass);
    errorText.textContent = message;
    errorText.classList.add(config.inputErrorClass);
};

// Убирает сообщение об ошибке
export const removeError = (form, input, config) => {
    const errorText = form.querySelector(`.${input.id}-error`);
    input.classList.remove(config.errorClass);
    errorText.textContent = '';
    errorText.classList.remove(config.inputErrorClass);
};

// Отключает кнопку отправки
const blockSubmitButton = (button, config) => {
    button.disabled = true;
    button.classList.add(config.inactiveButtonClass);
};

// Включает кнопку отправки
const unblockSubmitButton = (button, config) => {
    button.disabled = false;
    button.classList.remove(config.inactiveButtonClass);
};

// Проверяет наличие невалидных полей
export const containsInvalidInput = (inputs) => {
    return inputs.some(input => !input.validity.valid);
};

// Обновляет состояние кнопки отправки
export const updateSubmitState = (inputs, button, config) => {
    if (containsInvalidInput(inputs)) {
        blockSubmitButton(button, config);
    } else {
        unblockSubmitButton(button, config);
    }
};

// Назначает обработчики события ввода
export const applyValidationListeners = (form, config) => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const submitBtn = form.querySelector(config.submitButtonSelector);

    updateSubmitState(inputs, submitBtn, config);

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(form, input, config);
            updateSubmitState(inputs, submitBtn, config);
        });
    });
};

// Запускает валидацию для всех форм на странице
export const initFormValidation = (config) => {
    const forms = Array.from(document.querySelectorAll(config.formSelector));
    forms.forEach(form => applyValidationListeners(form, config));
};

// Сброс валидации при открытии формы
export const resetValidationState = (form, config) => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const submitBtn = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => removeError(form, input, config));
    blockSubmitButton(submitBtn, config);
};
