import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { MyGeolocation } from "./classes/my-geolocation";
import { MapService } from "./classes/map-service";
import { MyEventInsert } from "./myevent";
import { EventsService } from "./classes/events-service";
import { AuthService } from "./classes/auth-service";

AuthService.checkAuth("other");

let globalCoords = { latitude: 0, longitude: 0 };

document.addEventListener("DOMContentLoaded", () => {
    const newEventForm = document.getElementById("newEvent") as HTMLFormElement;
    const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
    const eventsService = new EventsService();

    const titleInput = newEventForm.querySelector("#title") as HTMLInputElement;
    const priceInput = newEventForm.querySelector("#price") as HTMLInputElement;
    const descriptionInput = newEventForm.querySelector("#description") as HTMLTextAreaElement;
    const dateInput = newEventForm.querySelector("#date") as HTMLInputElement;
    const imageInput = newEventForm.querySelector("#image") as HTMLInputElement;
    const addressInput = document.createElement("input");

    addressInput.type = "hidden";
    addressInput.id = "address";
    newEventForm.appendChild(addressInput);

    const latInput = document.createElement("input");
    latInput.type = "hidden";
    latInput.id = "lat";
    newEventForm.appendChild(latInput);

    const lngInput = document.createElement("input");
    lngInput.type = "hidden";
    lngInput.id = "lng";
    newEventForm.appendChild(lngInput);

    function setValidInput(input: HTMLInputElement | HTMLTextAreaElement, valid: boolean): void {
        input.classList.remove("is-valid", "is-invalid");
        input.classList.add(valid ? "is-valid" : "is-invalid");
    }

    function validatePrice(): boolean {
        const price = priceInput.value;
        const parsedPrice = parseFloat(price);
        const valid: boolean = !isNaN(parsedPrice) && parsedPrice > 0;
        setValidInput(priceInput, valid);
        return valid;
    }

    function validateTitle(): boolean {
        const valid: boolean = /^[a-zA-Z][a-zA-Z ]*$/.test(titleInput.value);
        setValidInput(titleInput, valid);
        return valid;
    }

    function validateDescription(): boolean {
        const valid: boolean = /.*\S.*/.test(descriptionInput.value);
        setValidInput(descriptionInput, valid);
        return valid;
    }

    function validateDate(): boolean {
        const valid: boolean = !!dateInput.value;
        setValidInput(dateInput, valid);
        return valid;
    }

    function validateImage(): boolean {
        const valid: boolean = imageInput.files !== null && imageInput.files.length > 0 && imageInput.files[0].type.startsWith('image');
        setValidInput(imageInput, valid);
        return valid;
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
            console.log(location.geometry.coordinates);
            marker.setGeometry(new Point(location.geometry.coordinates));
            mapService.view.setCenter(location.geometry.coordinates);
            globalCoords = { latitude: location.geometry.coordinates[1], longitude: location.geometry.coordinates[0] };
            latInput.value = globalCoords.latitude.toString();
            lngInput.value = globalCoords.longitude.toString();
            addressInput.value = autocomplete.querySelector("input")!.value;
        });
    }

    async function validateForm(event: Event): Promise<void> {
        event.preventDefault();

        const validations: boolean[] = [
            validateTitle(),
            validateDate(),
            validateDescription(),
            validatePrice(),
            validateImage()
        ];

        if (validations.every(v => v === true)) {
            try {
                const imageFile = imageInput.files ? imageInput.files[0] : null;

                if (imageFile) {
                    const reader = new FileReader();
                    reader.onload = async () => {
                        const base64Image = reader.result as string;

                        const eventData: MyEventInsert = {
                            title: titleInput.value,
                            description: descriptionInput.value,
                            date: dateInput.value,
                            price: parseFloat(priceInput.value),
                            address: addressInput.value,
                            lat: globalCoords.latitude,
                            lng: globalCoords.longitude,
                            image: base64Image
                        };

                        try {
                            const response = await eventsService.post(eventData);
                            if (response) {
                                window.location.href = "index.html";
                            } else {
                                alert("Error al crear el evento");
                            }
                        } catch (error) {
                            alert("Error: " + error);
                        }
                    };

                    reader.readAsDataURL(imageFile);
                } else {
                    alert("Por favor sube una imagen.");
                }
            } catch (error) {
                alert("Error: " + error);
            }
        }
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

    imageInput?.addEventListener("change", loadImage);
    newEventForm.addEventListener('submit', validateForm);

    showMap();

    document.getElementById("logout")?.addEventListener("click", () => {
        AuthService.logout();
    });
});
