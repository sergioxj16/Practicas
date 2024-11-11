import { AuthService } from "./classes/auth-service";
import { MyGeolocation } from "./classes/my-geolocation";
import { User } from "./interfaces/user";
import { MapService } from "./classes/map-service"; // Importa el MapService si es necesario

AuthService.checkAuth("register");

const formRegister = document.getElementById("form-register") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const email2Input = document.getElementById("email2") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const latInput = document.getElementById("lat") as HTMLInputElement;
const lngInput = document.getElementById("lng") as HTMLInputElement;
const photoInput = document.getElementById("photo") as HTMLInputElement;
const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
const errorInfo = document.getElementById("errorInfo") as HTMLParagraphElement;

let avatarBase64 = "";
let mapService: MapService | null = null;

MyGeolocation.getLocation()
    .then((coords) => {
        const latitude = coords.latitude;
        const longitude = coords.longitude;

        latInput.value = latitude.toString();
        lngInput.value = longitude.toString();

        // Inicializar el mapa y agregar el marcador
        mapService = new MapService({ latitude, longitude }, "map");
        mapService.createMarker({ latitude, longitude });
    })
    .catch((error) => {
        latInput.value = "";
        lngInput.value = "";
        errorInfo.textContent = "Error getting location: " + error;
    });

// Vista previa de la imagen Base64
function loadImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            avatarBase64 = reader.result as string;  // Guardamos el avatar en base64
            imgPreview.classList.remove("d-none");
            imgPreview.src = avatarBase64;  // Actualizamos la imagen vista previa
        };
    }
}

// Verifica que los emails coincidan
function checkMail(emailInput: string, email2Input: string): boolean {
    return emailInput === email2Input;
}

formRegister.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorInfo.textContent = "";

    // Validar que los emails coinciden
    if (checkMail(emailInput.value, email2Input.value)) {
        const userInfo: User = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            avatar: avatarBase64,  // Usamos el avatar en base64
            lat: parseFloat(latInput.value),
            lng: parseFloat(lngInput.value),
        };

        try {
            // Usar el servicio de autenticación para registrar al usuario
            const authService = new AuthService();
            await authService.register(userInfo);

            // Redirigir a login si el registro fue exitoso
            window.location.href = "login.html";
        } catch (error) {
            errorInfo.textContent = "" + error;
        }
    } else {
        errorInfo.textContent = "The emails do not match.";
    }
});

// Añadir evento para cargar la imagen seleccionada
photoInput.addEventListener("change", loadImage);
