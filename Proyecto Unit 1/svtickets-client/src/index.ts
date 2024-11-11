import { EventsService } from "./classes/events-service";
import { MyEvent } from "./interfaces/myevent";
import { AuthService } from "./classes/auth-service";

AuthService.checkAuth("other");

let events: MyEvent[] = [];
const eventsService = new EventsService();

const eventsContainer = document.getElementById("eventsContainer") as HTMLElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const eventTemplate = document.getElementById("eventTemplate") as HTMLTemplateElement;
const filterInfo = document.getElementById("filterInfo") as HTMLElement;
const loadMoreButton = document.getElementById("loadMore") as HTMLButtonElement;

let currentPage = 1;
let currentOrder = "distance";
let currentSearch = "";

// Obtener eventos con filtros de página, orden y búsqueda
async function getEvents() {
    try {
        const params = { page: currentPage, order: currentOrder, search: currentSearch };

        const { events: newEvents, page, more } = await eventsService.getEvents(params);

        if (page === 1) events = [];
        events = [...events, ...newEvents];
        showEvents(events);
        loadMoreButton.style.display = more ? "block" : "none";
    } catch (error) {
        console.error("Error al obtener los eventos:", error);
        alert("Events cannot be loaded. Try again later.");
    }
}

// Mostrar eventos en el contenedor de HTML
function showEvents(events: MyEvent[]) {
    eventsContainer.replaceChildren(...events.map(eventToHTML));
}

// Convertir un evento a un elemento HTML usando la plantilla
function eventToHTML(event: MyEvent): HTMLElement {
    const dateFormatted = new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(event.date));

    const priceFormatted = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "EUR",
    }).format(event.price);

    const distanceFormatted = `${event.distance.toFixed(2)} km`;

    const eventHTML = eventTemplate.content.cloneNode(true) as DocumentFragment;
    const eventCard = eventHTML.firstElementChild as HTMLElement;

    (eventCard.querySelector(".card-img-top") as HTMLImageElement).src = event.image;
    (eventCard.querySelector(".card-title") as HTMLElement).textContent = event.title;
    (eventCard.querySelector("p.card-text") as HTMLElement).textContent = event.description;
    (eventCard.querySelector(".date") as HTMLElement).textContent = dateFormatted;
    (eventCard.querySelector(".price") as HTMLElement).textContent = priceFormatted;
    (eventCard.querySelector(".distance") as HTMLElement).textContent = distanceFormatted;

    // Actualizar el número de asistentes
    const peopleCount = eventCard.querySelector(".attend-users") as HTMLElement;
    peopleCount.textContent = `${event.numAttend} ${event.numAttend === 1 ? "person" : "people"}`;

    if (event.creator && event.creator.avatar) {
        (eventCard.querySelector(".avatar img") as HTMLImageElement).src = event.creator.avatar;
    }
    if (event.creator && event.creator.name) {
        (eventCard.querySelector(".name a") as HTMLAnchorElement).textContent = event.creator.name;
    }

    const deleteBtn = eventCard.querySelector("button.delete") as HTMLButtonElement;
    if (event.mine) {
        deleteBtn.style.display = "block";
        deleteBtn.addEventListener("click", async () => {
            const del = confirm("¿Are you sure you want to delete this event?");
            if (del) {
                await eventsService.delete(event.id);
                eventCard.remove();
            }
        });
    } else {
        deleteBtn.style.display = "none";
    }

    return eventCard;
}


// Eventos de ordenamiento
document.getElementById("orderPrice")?.addEventListener("click", (e) => {
    e.preventDefault();
    currentOrder = "price";
    filterInfo.textContent = "Ordering by: price";
    currentPage = 1;
    getEvents();
});

document.getElementById("orderDate")?.addEventListener("click", (e) => {
    e.preventDefault();
    currentOrder = "date";
    filterInfo.textContent = "Ordering by: date";
    currentPage = 1;
    getEvents();
});

document.getElementById("orderDistance")?.addEventListener("click", (e) => {
    e.preventDefault();
    currentOrder = "distance";
    filterInfo.textContent = "Ordering by: distance";
    currentPage = 1;
    getEvents();
});

// Evento de búsqueda
searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    filterInfo.textContent = `Ordering by: ${currentOrder}. Searching by: "${currentSearch}"`;
    currentPage = 1;
    getEvents();
});

// Botón de cargar más
loadMoreButton.addEventListener("click", () => {
    currentPage++;
    getEvents();
});

// Seleccionamos el botón de logout y le añadimos el evento
document.getElementById("logout")?.addEventListener("click", () => {
    AuthService.logout();
});

getEvents();