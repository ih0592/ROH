document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }
});

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    // Reset error messages
    clearErrors();

    // Validate name
    if (name.length < 2) {
        showError('name', 'Vul een geldige naam in');
        isValid = false;
    }

    // Validate email
    if (!isValidEmail(email)) {
        showError('email', 'Vul een geldig e-mailadres in');
        isValid = false;
    }

    // Validate phone (optional)
    if (phone && !isValidPhone(phone)) {
        showError('phone', 'Vul een geldig telefoonnummer in');
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        showError('message', 'Uw bericht moet minimaal 10 karakters bevatten');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9\-\+\(\)\s]{10,}$/.test(phone);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    field.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}

async function submitForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Verzenden...';

        // Hier zou je normaal gesproken een fetch call maken naar je backend
        // Voor nu simuleren we een succesvol verzonden formulier
        await new Promise(resolve => setTimeout(resolve, 1500));

        showSuccess();
        form.reset();
    } catch (error) {
        showError('form', 'Er is iets misgegaan. Probeer het later opnieuw.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Verstuur';
    }
}

function showSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Uw bericht is succesvol verzonden. Wij nemen zo spoedig mogelijk contact met u op.';
    form.parentNode.insertBefore(successMessage, form);

    setTimeout(() => {
        successMessage.remove();
    }, 5000);
} 