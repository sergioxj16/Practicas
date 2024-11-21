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

    if (!emailInput.value || !passwordInput.value) {
        errorInfo.textContent = "Please enter email and password.";
    } else {
        try {
            const coords = await MyGeolocation.getLocation();
            const latitude = coords.latitude;
            const longitude = coords.longitude;

            const userLogin = {
                email: emailInput.value,
                password: passwordInput.value,
                lat: latitude,
                lng: longitude
            };

            const token: string = await authService.login(userLogin);

            if (token) {
                window.location.href = "index.html";
            }
        } catch (error) {
            errorInfo.textContent = "" + error;
        }
    }
});
