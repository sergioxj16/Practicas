import { REGISTER_URL } from "./constants";
import { MapService } from "./classes/map-service";
import { User } from "./interfaces/user";

const formRegister = document.getElementById("form-register") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const email2Input = document.getElementById("email2") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const latIn = document.getElementById("lat") as HTMLInputElement;
const lngIn = document.getElementById("lng") as HTMLInputElement;
const photoIn = document.getElementById("photo") as HTMLInputElement;
const imgPrev = document.getElementById("imgPreview") as HTMLImageElement;
const errorInfo = document.getElementById("errorInfo") as HTMLParagraphElement;

let avatarBase64 = "";
let mapService: MapService | null = null;

navigator.geolocation.getCurrentPosition(
    position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        latIn.value = latitude.toString();
        lngIn.value = longitude.toString();

        // Inicializar el mapa y agregar el marcador
        mapService = new MapService({ latitude, longitude }, "map");
        mapService.createMarker({ latitude, longitude });
    },
    () => {
        latIn.value = "0";
        lngIn.value = "0";
        errorInfo.textContent = "No se pudo obtener la ubicación.";
    }
);

// Vista previa de la imagen Base64
photoIn.addEventListener("change", () => {
    const file = photoIn.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            avatarBase64 = reader.result as string;
            imgPrev.src = avatarBase64;
            imgPrev.classList.remove("d-none");
        };
        reader.readAsDataURL(file);
    }
});

formRegister.addEventListener("submit", async event => {
    event.preventDefault();
    errorInfo.textContent = "";

    // Validar que los emails coinciden
    if (emailInput.value !== email2Input.value) {
        errorInfo.textContent = "Los correos electrónicos no coinciden.";
        return;
    }

    // Crear el objeto de usuario utilizando la clase User
    const user: User = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        avatar: avatarBase64,
        lat: parseFloat(latIn.value),
        lng: parseFloat(lngIn.value)
    };

    try {
        const response = await fetch(REGISTER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            window.location.href = "login.html";
        } else {
            const errorData = await response.json();
            errorInfo.textContent = errorData.message.join(", ");
        }
    } catch (error) {
        errorInfo.textContent = "Error en la solicitud, intenta de nuevo." + error;
    }
});
