import { UserService } from "./classes/user-service";
import { User } from "./interfaces/user";
import { MapService } from "./classes/map-service";
import { AuthService } from "./classes/auth-service";
import { Coordinates } from "./interfaces/coordinates";

const userService = new UserService();

AuthService.checkAuth("other");

const profileInfo = document.getElementById("profileInfo") as HTMLElement;
const profileForm = document.getElementById("profileForm") as HTMLElement;
const passwordForm = document.getElementById("passwordForm") as HTMLElement;
const editProfileBtn = document.getElementById("editProfile") as HTMLButtonElement;
const editPasswordBtn = document.getElementById("editPassword") as HTMLButtonElement;
const cancelEditProfileBtn = document.getElementById("cancelEditProfile") as HTMLButtonElement;
const cancelEditPasswordBtn = document.getElementById("cancelEditPassword") as HTMLButtonElement;
const photoInput = document.getElementById("photoInput") as HTMLInputElement;
const nameElement = document.getElementById("name") as HTMLElement;
const emailElement = document.getElementById("email") as HTMLElement;
const mapElementId = "map";

const nameRegex = /^[a-zA-Z\s]{2,50}$/; // Permite letras y espacios, entre 2 y 50 caracteres.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida un correo electrónico estándar.

async function loadUserProfile(): Promise<void> {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("id");
        const profile = userId
            ? await userService.getUserProfileById(userId)
            : await userService.getUserProfile();

        if (profile) {
            nameElement.textContent = profile.name;
            emailElement.textContent = profile.email;
            (document.getElementById("avatar") as HTMLImageElement).src = profile.avatar;

            if (!profile.me) {
                editProfileBtn.classList.add("d-none");
                editPasswordBtn.classList.add("d-none");
                photoInput.parentElement?.classList.add("d-none");
            } else {
                initEditButtons(profile);
            }

            initMap({ latitude: profile.lat, longitude: profile.lng });
        }
    } catch (error) {
        console.error("Error loading user profile:", error);
        alert("An error occurred while loading the profile. Please try again later.");
    }
}

function initEditButtons(profile: User) {
    editProfileBtn.addEventListener("click", () => {
        profileInfo.classList.add("d-none");
        profileForm.classList.remove("d-none");
        (document.getElementById("name") as HTMLInputElement).value = profile.name;
        (document.getElementById("email2") as HTMLInputElement).value = profile.email;
    });

    cancelEditProfileBtn.addEventListener("click", () => {
        profileForm.classList.add("d-none");
        profileInfo.classList.remove("d-none");
    });

    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = (document.getElementById("name2") as HTMLInputElement).value.trim();
        const mail = (document.getElementById("email2") as HTMLInputElement).value.trim();

        if (!nameRegex.test(name)) {
            alert("Invalid name. Please enter 2 to 50 alphabetic characters.");
        } else if (!emailRegex.test(mail)) {
            alert("Invalid email format. Please enter a valid email.");
        } else {
            try {
                await userService.updateUserProfile(name, mail);
                nameElement.textContent = name;
                emailElement.textContent = mail;

                profileForm.classList.add("d-none");
                profileInfo.classList.remove("d-none");
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("An error occurred while updating the profile. Please try again.");
            }
        }
    });

    editPasswordBtn.addEventListener("click", () => {
        profileInfo.classList.add("d-none");
        passwordForm.classList.remove("d-none");
    });

    cancelEditPasswordBtn.addEventListener("click", () => {
        passwordForm.classList.add("d-none");
        profileInfo.classList.remove("d-none");
    });

    passwordForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const password2 = (document.getElementById("password2") as HTMLInputElement).value;

        if (!password || password !== password2) {
            alert("Passwords do not match or are empty.");
        } else {
            try {
                await userService.changePassword(password);
                passwordForm.classList.add("d-none");
                profileInfo.classList.remove("d-none");
            } catch (error) {
                console.error("Error changing password:", error);
                alert("An error occurred while changing the password. Please try again.");
            }
        }
    });

    photoInput.addEventListener("change", async () => {
        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
    
            if (file.type === "image/jpeg" || file.type === "image/png") {
                try {
                    const base64Image = await convertFileToBase64(file);
                    await userService.updateAvatar(base64Image);
                    window.location.reload();
                } catch (error) {
                    console.error("Error updating avatar:", error);
                    alert("An error occurred while uploading the image. Please try again.");
                }
            } else {
                alert("Please select a JPG or PNG image.");
            }
        } else {
            alert("No file selected.");
        }
    });
    
}

function convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

function initMap(coordinates: Coordinates) {
    const mapService = new MapService(coordinates, mapElementId);
    mapService.createMarker(coordinates);
}

loadUserProfile();

document.getElementById("logout")?.addEventListener("click", () => {
    AuthService.logout();
});
