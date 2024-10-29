import { EventsService } from './events-service.js';

const newEventForm = document.getElementById('newEvent');
const imgPreview = document.getElementById('imgPreview');

newEventForm.image.addEventListener('change', event => {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file);
        reader.addEventListener('load', e => {
            imgPreview.src = reader.result;
            imgPreview.classList.remove('d-none');
        });
    }
});

function validation(input, isValid) {
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
    return isValid;
}

function validateTitle(value) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(value);
}

function validateNonEmpty(value) {
    return value.trim() !== "";
}

function validatePositiveNumber(value) {
    return value > 0;
}

newEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let title = document.getElementById('title').value.trim();
    let date = document.getElementById('date').value;
    let description = document.getElementById('description').value.trim();
    let price = parseFloat(document.getElementById('price').value);
    let imageFile = document.getElementById('image').files[0];

    let isValid = true;

    const titleIsValid = validateTitle(title);
    isValid = validation(newEventForm.title, titleIsValid) && isValid;

    const descriptionIsValid = validateNonEmpty(description);
    isValid = validation(newEventForm.description, descriptionIsValid) && isValid;

    const dateIsValid = validateNonEmpty(date);
    isValid = validation(newEventForm.date, dateIsValid) && isValid;

    const priceIsValid = validatePositiveNumber(price);
    isValid = validation(newEventForm.price, priceIsValid) && isValid;

    const imgIsValid = imageFile !== undefined;
    isValid = validation(newEventForm.image, imgIsValid) && isValid;

    if (isValid) {
        const imageBase64 = await convertImageToBase64(imageFile);

        const newEvent = {
            title,
            date,
            description,
            price,
            image: imageBase64
        };

        try {
            const eventService = new EventsService();
            await eventService.post(newEvent);
            location.assign('index.html');
        } catch (error) {
            console.error('Error creating the event:', error);
            alert('Could not create the event. Please try again.');
        }
    }
});

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
