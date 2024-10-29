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
    
    document.getElementById('search').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const filteredEvents = events.filter(event =>
            event.name.toLowerCase().includes(search) || 
            (event.description && event.description.toLowerCase().includes(search))
        );
        displayEvents(filteredEvents);
    });
});

function displayEvents(events) {
    const eventsContainer = document.getElementById('eventsContainer');
    eventsContainer.replaceChildren();
    events.forEach(event => {
        const eventHTML = createEventHTML(event);
        eventsContainer.appendChild(eventHTML);
    });
}

function createEventHTML(event) {

    const template = document.getElementById('eventTemplate');
    const clone = template.content.cloneNode(true);

    const img = clone.querySelector('.card-img-top');
    img.src = event.image;
    img.alt = event.name;

    const title = clone.querySelector('.card-title');
    title.textContent = event.name || event.title;

    const description = clone.querySelector('.card-text');
    description.textContent = event.description;

    const dateDiv = clone.querySelector('.event-date');
    dateDiv.textContent = new Date(event.date).toLocaleDateString();

    const priceDiv = clone.querySelector('.event-price');
    priceDiv.textContent = `${event.price} €`;

    const btnDelete = clone.querySelector('.delete');
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

    return clone;
}
