"use strict";

const newEventForm = document.getElementById('newEvent');
const imgPreview = document.getElementById('imgPreview');
const eventsContainer = document.getElementById('eventsContainer');

newEventForm.image.addEventListener('change', event => {
    let file = event.target.files[0];
    let reader = new FileReader();
    if (file) reader.readAsDataURL(file);
    reader.addEventListener('load', e => {
        imgPreview.src = reader.result;
        imgPreview.classList.remove('d-none');
    });
});

function validation(input, isValid) {
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.add('is-invalid');
    }
    return isValid;
}

function validateTitle(value, regex) {
    return regex.test(value);
}

function validateNonEmpty(value) {
    return value.trim() !== "";
}

function validatePositiveNumber(value) {
    return value > 0;
}

newEventForm.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;
    const title = newEventForm.title;
    const date = newEventForm.date;
    const description = newEventForm.description;
    const price = newEventForm.price;
    const img = newEventForm.image;

    const titleIsValid = validateTitle(title.value, /^[a-zA-Z\s]+$/);
    isValid = validation(title, titleIsValid) && isValid;

    const descriptionIsValid = validateNonEmpty(description.value);
    isValid = validation(description, descriptionIsValid) && isValid;

    const dateIsValid = validateNonEmpty(date.value);
    isValid = validation(date, dateIsValid) && isValid;

    const priceIsValid = validatePositiveNumber(price.value);
    isValid = validation(price, priceIsValid) && isValid;

    const imgIsValid = img.files[0] !== undefined;
    isValid = validation(img, imgIsValid) && isValid;

    if (isValid) {
        addEvent(title.value, description.value, date.value, price.value, imgPreview.src);
        newEventForm.reset();
        imgPreview.src = "";
        imgPreview.classList.add('d-none');
        document.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    }
});

function addEvent(title, description, date, price, imgSrc) {
    const col = document.createElement('div');
    col.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow');

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = imgSrc;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h4');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = title;

    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = description;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'delete');
    
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('bi', 'bi-trash');
    deleteBtn.appendChild(trashIcon);
    
    deleteBtn.addEventListener('click', () => col.remove());

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer', 'text-muted', 'row', 'm-0');

    const cardDate = document.createElement('div');
    cardDate.classList.add('col');
    cardDate.textContent = new Intl.DateTimeFormat('en-GB').format(new Date(date));

    const cardPrice = document.createElement('div');
    cardPrice.classList.add('col', 'text-end');
    cardPrice.textContent = new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(deleteBtn);
    cardFooter.appendChild(cardDate);
    cardFooter.appendChild(cardPrice);
    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);
    eventsContainer.appendChild(col);
}