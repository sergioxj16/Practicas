import { EventsService } from './events-service.js';

const newEventForm = document.getElementById("newEvent");
const imgPreview = document.getElementById("imgPreview");
const eventsService = new EventsService();

function setValidInput(input, valid) {
    input.classList.remove("is-valid", "is-invalid");
    if (valid) {
        input.classList.add("is-valid");
    } else {
        input.classList.add("is-invalid");
    }
}
// expr.test(input.value)
function validatePrice() {
    const valid = newEventForm.price.value && newEventForm.price.value > 0;
    setValidInput(newEventForm.price, valid);
    return valid;
}

function validateTitle() {
    const valid = /[a-z][a-z ]*/.test(newEventForm.title.value);
    setValidInput(newEventForm.title, valid);
    return valid;
}

function validateDescription() {
    const valid = /.*\S.*/.test(newEventForm.description.value);
    setValidInput(newEventForm.description, valid);
    return valid;
}

function validateDate() {
    const valid = !!newEventForm.date.value;
    setValidInput(newEventForm.date, valid);
    return valid;
}

function validateImage() {
    const valid = newEventForm.image.files.length > 0 && newEventForm.image.files[0].type.startsWith('image');
    setValidInput(newEventForm.image, valid);
    return valid;
}

async function validateForm(event) {
    event.preventDefault();

    let validations = [validateTitle(), validateDate(), validateDescription(), validatePrice(), validateImage()];

    if (validations.every(v => v === true)) { // Check all validations
        try {
            await eventsService.post({
                title: newEventForm.title.value,
                image: imgPreview.src,
                date: newEventForm.date.value,
                description: newEventForm.description.value,
                price: newEventForm.price.value
            });
            location.assign("index.html");
        } catch(e) {
            alert("Error adding the event!")
        }
    }
}

function loadImage(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if (file) reader.readAsDataURL(file);

    reader.addEventListener('load', e => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = reader.result;
    });
}

newEventForm.image.addEventListener('change', loadImage);
newEventForm.addEventListener('submit', validateForm);


