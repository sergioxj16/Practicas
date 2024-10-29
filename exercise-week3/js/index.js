import { EventsService } from './events-service.js';

let events = [];

document.addEventListener('DOMContentLoaded', async () => {
    const eventService = new EventsService();
    try {
        events = await eventService.getEvents();
        displayEvents(events);
    } catch (error) {
        console.error('Error loading events:', error);
    }

    document.getElementById('orderDate').addEventListener('click', () => {
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        displayEvents(events);
        document.getElementById('search').value = '';
    });

    document.getElementById('orderPrice').addEventListener('click', () => {
        events.sort((a, b) => a.price - b.price);
        displayEvents(events);
        document.getElementById('search').value = '';
    });
    
    // document.getElementById('search').addEventListener('input', (e) => {
    //     const search = e.target.value.toLowerCase();
    //     const filteredEvents = events.filter(event =>
    //         event.name.toLowerCase().includes(search)
    //     );
    //     displayEvents(filteredEvents);
    // });

});

function displayEvents(events) {
    const eventsContainer = document.getElementById('eventsContainer');
    Array.from(eventsContainer.childNodes).forEach(child => {
        eventsContainer.removeChild(child);
    });

    events.forEach(event => {
        const eventHTML = createEventHTML(event);
        eventsContainer.appendChild(eventHTML);
    });
}

function createEventHTML(event) {
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('col');

    const card = document.createElement('div');
    card.classList.add('card', 'shadow');

    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = event.image;
    img.alt = event.name;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h4');
    title.classList.add('card-title');
    title.textContent = event.name || event.title;

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = event.description;

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn', 'btn-danger', 'delete');
    
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('bi', 'bi-trash');
    btnDelete.appendChild(trashIcon);
    
    btnDelete.addEventListener('click', async () => {
        const confirmDelete = confirm(`Are you sure you want to delete the event?`);
        if (confirmDelete) {
            try {
                const eventService = new EventsService();
                await eventService.delete(event.id);
                events = events.filter(e => e.id !== event.id);
                displayEvents(events);
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    });

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer', 'text-muted', 'row', 'm-0');

    const dateDiv = document.createElement('div');
    dateDiv.classList.add('col');
    dateDiv.textContent = new Date(event.date).toLocaleDateString();

    const priceDiv = document.createElement('div');
    priceDiv.classList.add('col', 'text-end');
    priceDiv.textContent = `${event.price} €`;

    cardFooter.appendChild(dateDiv);
    cardFooter.appendChild(priceDiv);

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(btnDelete);

    card.appendChild(img);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    eventDiv.appendChild(card);

    return eventDiv;
}
