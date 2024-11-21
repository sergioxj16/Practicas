import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { MyGeolocation } from "./classes/my-geolocation";
import { MapService } from "./classes/map-service";
import { Point } from "ol/geom";
import { MyEventInsert } from "./interfaces/myevent";
import { EventsService } from "./classes/events-service";
import { AuthService } from "./classes/auth-service";
import { Coordinates } from "./interfaces/coordinates";

AuthService.checkAuth("other");

const globalCoordinates: Coordinates = {
    latitude: 0,
    longitude: 0,
};

const newEventForm = document.getElementById("newEvent") as HTMLFormElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const titleInput = newEventForm.querySelector("#title") as HTMLInputElement;
const priceInput = newEventForm.querySelector("#price") as HTMLInputElement;
const descriptionInput = newEventForm.querySelector(
    "#description"
) as HTMLTextAreaElement;
const dateInput = newEventForm.querySelector("#date") as HTMLInputElement;
const imageInput = newEventForm.querySelector("#image") as HTMLInputElement;
const autocompleteDiv = document.getElementById("autocomplete")!;
const eventsService = new EventsService();

function setValidInput(
    input: HTMLInputElement | HTMLTextAreaElement,
    valid: boolean
): void {
    input.classList.remove("is-valid", "is-invalid");
    input.classList.add(valid ? "is-valid" : "is-invalid");
}

function validatePrice(): boolean {
    const price = parseFloat(priceInput.value);
    const valid = !isNaN(price) && price > 0;
    setValidInput(priceInput, valid);
    return valid;
}

function validateTitle(): boolean {
    const valid = /^[a-zA-Z][a-zA-Z ]*$/.test(titleInput.value);
    setValidInput(titleInput, valid);
    return valid;
}

function validateDescription(): boolean {
    const valid = /.*\S.*/.test(descriptionInput.value);
    setValidInput(descriptionInput, valid);
    return valid;
}

function validateDate(): boolean {
    const valid = !!dateInput.value;
    setValidInput(dateInput, valid);
    return valid;
}

function validateImage(): boolean {
    const valid: boolean =
        imageInput.files !== null &&
        imageInput.files.length > 0 &&
        imageInput.files[0].type.startsWith("image");
    setValidInput(imageInput, valid);
    return valid;
}

function loadImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            imgPreview.classList.remove("d-none");
            imgPreview.src = reader.result as string;
        };
    }
}

async function showMap() {
    const coords = await MyGeolocation.getLocation();
    const mapService = new MapService(coords, "map");
    const marker = mapService.createMarker(coords);

    const autocomplete = new GeocoderAutocomplete(
        document.getElementById("autocomplete")!,
        "42c7710f83bc41698b841fec7a3b5d2d",
        { lang: "es", debounceDelay: 600 }
    );

    autocomplete.on("select", (location) => {
        const locationCoords = location.geometry.coordinates as [
            number,
            number
        ];

        globalCoordinates.latitude = locationCoords[1];
        globalCoordinates.longitude = locationCoords[0];

        marker.setGeometry(new Point(locationCoords));
        mapService.view.setCenter(locationCoords);
    });
}

async function validateForm(event: Event): Promise<void> {
    event.preventDefault();

    if (!validateTitle()) {
        return;
    }
    if (!validateDate()) {
        return;
    }
    if (!validateDescription()) {
        return;
    }
    if (!validatePrice()) {
        return;
    }
    if (!validateImage()) {
        return;
    }

    const imageFile = imageInput.files ? imageInput.files[0] : null;
    if (!imageFile) {
        alert("Por favor sube una imagen.");
        return;
    }

    const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject("Error al leer el archivo");
        reader.readAsDataURL(imageFile);
    });

    const addressInputValue = (
        autocompleteDiv.querySelector(
            ".geoapify-autocomplete-input"
        )! as HTMLInputElement
    ).value;

    const eventData: MyEventInsert = {
        title: titleInput.value,
        description: descriptionInput.value,
        date: dateInput.value,
        price: parseFloat(priceInput.value),
        address: addressInputValue,
        lat: globalCoordinates.latitude,
        lng: globalCoordinates.longitude,
        image: base64Image,
    };

    try {
        const response = await eventsService.post(eventData);
        if (response) {
            window.location.href = "index.html";
        } else {
            alert("Error al crear el evento");
        }
    } catch (error) {
        console.log(error);
    }
}

showMap();
imageInput.addEventListener("change", loadImage);
newEventForm.addEventListener("submit", validateForm);

document.getElementById("logout")?.addEventListener("click", () => {
    AuthService.logout();
});
