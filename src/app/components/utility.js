export function showInputError(element, message = null) {
    element.classList.add('error');
    element.classList.add('shake');
    element.focus();

    if (message) showErrorMessage(element, message);

    setTimeout(() => { 
        element.classList.remove('shake'); 
    }, 500);

    const clearOnInput = () => {
        clearInputError(element);
        element.removeEventListener('input', clearOnInput);
    };
    element.addEventListener('input', clearOnInput);
}

export function clearInputError(element) {
    element.classList.remove('error');
    element.classList.remove('shake');

    removeErrorMessage(element);
}

function showErrorMessage(element, message) {
    removeErrorMessage(element);
    const errorMsg = document.createElement('span');
    errorMsg.classList.add('error-message');
    errorMsg.textContent = message;
    element.parentElement.insertBefore(errorMsg, element.nextSibling);
}

function removeErrorMessage(element) {
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
}