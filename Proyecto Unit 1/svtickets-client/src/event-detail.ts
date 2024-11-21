import { AuthService } from "./classes/auth-service";
import { EventsService } from "./classes/events-service";
import { MapService } from "./classes/map-service";
import { MyEvent } from "./interfaces/myevent";
import { User } from "./interfaces/user";

const eventsService = new EventsService();
AuthService.checkAuth("other");

const eventContainer = document.getElementById("eventContainer") as HTMLElement;
const mapElementId = "map";
const userList = document.getElementById("userList") as HTMLElement;

async function loadEventDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get("id");

        if (!eventId) {
            window.location.href = "index.html";
            return;
        }

        const event = await eventsService.getEventById(Number(eventId));

        if (!event) {
            console.error("Event not found.");
            window.location.href = "index.html";
            return;
        }

        renderEventCard(event);

        loadMap(event.lat, event.lng);

        loadAttendees(event.id);

    } catch (error) {
        console.error("Error loading event details:", error);
        window.location.href = "index.html";
    }
}

function renderEventCard(event: MyEvent) {
    const eventTemplate = document.getElementById("eventTemplate") as HTMLTemplateElement;
    const eventClone = eventTemplate.content.cloneNode(true) as HTMLElement;

    const eventImage = eventClone.querySelector(".card-img-top") as HTMLImageElement;
    const eventTitle = eventClone.querySelector(".card-title a") as HTMLAnchorElement;
    const eventDescription = eventClone.querySelector(".card-text") as HTMLParagraphElement;
    const eventCreatorAvatar = eventClone.querySelector(".avatar img") as HTMLImageElement;
    const eventCreatorName = eventClone.querySelector(".name a") as HTMLAnchorElement;
    const eventDate = eventClone.querySelector(".date") as HTMLSpanElement;
    const eventPrice = eventClone.querySelector(".price") as HTMLSpanElement;
    const eventDistance = eventClone.querySelector(".distance") as HTMLSpanElement;

    eventImage.src = event.image;
    eventTitle.href = `event-detail.html?id=${event.id}`;
    eventTitle.textContent = event.title;
    eventDescription.textContent = event.description;
    eventCreatorAvatar.src = event.creator.avatar;
    eventCreatorName.href = `profile.html?id=${event.creator.id}`;
    eventCreatorName.textContent = event.creator.name;
    eventDate.textContent = new Date(event.date).toLocaleString();
    eventPrice.textContent = `€${event.price.toFixed(2)}`;
    eventDistance.textContent = `${event.distance} km`;

    eventContainer.appendChild(eventClone);

    attachEventActions(event.id, event.mine);
}

function attachEventActions(eventId: number, isMine: boolean) {
    const deleteButton = document.querySelector(".delete") as HTMLElement;
    if (deleteButton && isMine) {
        deleteButton.style.display = "block";  
        deleteButton.addEventListener("click", async () => {
            await eventsService.delete(eventId);
            window.location.href = "index.html";
        });
    } else if (deleteButton) {
        deleteButton.style.display = "none";  
    }
}

async function loadAttendees(eventId: number) {
    try {
        const attendees = await eventsService.getEventAttendees(eventId);

        if (userList) {
            userList.innerHTML = "";

            const attendeesCount = attendees.users.length;

            const attendeesCountElement = document.getElementById("attendeesCount");
            if (attendeesCountElement) {
                attendeesCountElement.textContent = `${attendeesCount} ${attendeesCount === 1 ? 'attendee' : 'attendees'}`;
            }

            if (attendeesCount === 0) {
                const noAttendeesMessage = document.createElement("p");
                noAttendeesMessage.textContent = "No attendees yet.";
                userList.appendChild(noAttendeesMessage);
            } else {
                attendees.users.forEach((user: User) => {
                    const attendeeTemplate = document.getElementById("attendTemplate") as HTMLTemplateElement;
                    const attendeeClone = attendeeTemplate.content.cloneNode(true) as HTMLElement;

                    const attendeeAvatar = attendeeClone.querySelector(".avatar img") as HTMLImageElement;
                    const attendeeName = attendeeClone.querySelector(".name") as HTMLAnchorElement;
                    const attendeeEmail = attendeeClone.querySelector(".email") as HTMLSpanElement;

                    attendeeAvatar.src = user.avatar;
                    attendeeName.href = `profile.html?id=${user.id}`;
                    attendeeName.textContent = user.name;
                    attendeeEmail.textContent = user.email;

                    if (user.me) {
                        attendeeName.textContent = `${user.name} (You)`;
                    }

                    userList.appendChild(attendeeClone);
                });
            }
        }
    } catch (error) {
        console.error("Error loading attendees:", error);
    }
}


function loadMap(lat: number, lng: number) {
    const mapService = new MapService({ latitude: lat, longitude: lng }, mapElementId);
    mapService.createMarker({ latitude: lat, longitude: lng });

    const addressElement = document.getElementById("address")!;
    addressElement.textContent = `Event Address: ${lat}, ${lng}`; 
}

document.getElementById("logout")?.addEventListener("click", () => {
    AuthService.logout();
});

loadEventDetails();
