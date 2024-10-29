import { EventsService } from './events-service.js';

let events = [];
const eventsService = new EventsService();

const eventsContainer = document.getElementById("eventsContainer");
const searchInput = document.getElementById("search");


async function getEvents() {
    events = await eventsService.getEvents();
    showEvents(events);
}

function showEvents(events) {
    eventsContainer.replaceChildren(...events.map(e => eventToHTML(e)));
}

function eventToHTML(event) {
    let col = document.createElement("div");
    col.classList.add("col");

    let card = document.createElement("div");
    card.classList.add("card", "shadow");
    col.append(card);

    let img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = event.image;
    card.append(img);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.append(cardBody);

    let cardTitle = document.createElement("h4");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = event.title;
    cardBody.append(cardTitle);

    let cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.innerText = event.description;
    cardBody.append(cardText);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn", "btn-danger", "delete");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-trash");
    deleteBtn.append(deleteIcon);
    cardBody.append(deleteBtn);

    let cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer", "text-muted", "row", "m-0");
    card.append(cardFooter);

    let dateObj = new Date(event.date);
    const dateFormatter = Intl.DateTimeFormat('en', {
        day: "2-digit", month: "2-digit", year: "numeric"
    });

    let dateText = document.createElement("div");
    dateText.classList.add("col");
    dateText.textContent = dateFormatter.format(dateObj);
    cardFooter.append(dateText);

    let priceText = document.createElement("div");
    priceText.classList.add("col", "text-end");
    priceText.textContent = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(+event.price);
    cardFooter.append(priceText);

    deleteBtn.addEventListener("click", async e => {
        let del = confirm("¿Are you sure you want to delete this event?");
        if (del) {
            await eventsService.delete(event.id);
            col.remove();
        }
    });

    return col;
}


getEvents();

document.getElementById("orderPrice").addEventListener("click", e => {
    e.preventDefault();
    searchInput.value = "";
    events.sort((e1, e2) => e1.price - e2.price);
    showEvents(events);
});

document.getElementById("orderDate").addEventListener("click", e => {
    e.preventDefault();
    searchInput.value = "";
    events.sort((e1, e2) => e1.date.localeCompare(e2.date));
    showEvents(events);
});

searchInput.addEventListener("input", e => {
    const filtered = events.filter(e => 
        e.title.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()) ||
        e.description.toLocaleLowerCase().includes(searchInput.value.toLocaleLowerCase()));
    showEvents(filtered);
});
