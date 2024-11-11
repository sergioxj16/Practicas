// login.ts: Archivo principal para la gestión de la página de inicio de sesión.
// - Implementar la lógica para iniciar sesión en el sistema.
// - Geolocalizar al usuario y enviar latitud y longitud junto con el inicio de sesión.
// - Validar que los campos de email y contraseña no estén vacíos.
// - Mostrar mensajes de error si el inicio de sesión falla.
// - Guardar el token de autenticación en localStorage si el inicio de sesión es exitoso.

import { AuthService } from "./classes/auth-service";
import { MyGeolocation } from "./classes/my-geolocation";

AuthService.checkAuth("login");

const authService = new AuthService();
const formLogin = document.getElementById("form-login") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorInfo = document.getElementById("errorInfo") as HTMLParagraphElement;

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorInfo.textContent = "";

    // Validación de campos vacíos
    if (!emailInput.value || !passwordInput.value) {
        errorInfo.textContent = "Please enter email and password.";
    } else {
        try {
            // Obtener la ubicación del usuario
            const coords = await MyGeolocation.getLocation();
            const latitude = coords.latitude;
            const longitude = coords.longitude;

            // Crear el objeto con los datos del usuario
            const userLogin = {
                email: emailInput.value,
                password: passwordInput.value,
                lat: latitude,
                lng: longitude
            };

            // Iniciar sesión enviando el objeto con los datos del usuario
            const token: string = await authService.login(userLogin);

            // Redirigir a la página principal si el inicio de sesión es exitoso
            if (token) {
                window.location.href = "index.html";
            }
        } catch (error) {
            errorInfo.textContent = "" + error;
        }
    }
});
