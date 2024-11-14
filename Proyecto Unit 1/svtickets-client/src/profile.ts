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

async function loadUserProfile(): Promise<void> {
    const profile = await userService.getUserProfile();
    
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
}

function initEditButtons(profile: User) {
    editProfileBtn.onclick = () => {
        profileInfo.classList.add("d-none");
        profileForm.classList.remove("d-none");
        (document.getElementById("name") as HTMLInputElement).value = profile.name;
        (document.getElementById("email2") as HTMLInputElement).value = profile.email;
    };

    cancelEditProfileBtn.onclick = () => {
        profileForm.classList.add("d-none");
        profileInfo.classList.remove("d-none");
    };

    profileForm.onsubmit = async (event) => {
        event.preventDefault();
        const name = (document.getElementById("name") as HTMLInputElement).value.trim();
        const email = (document.getElementById("email2") as HTMLInputElement).value.trim();
        if (name && email) {
            await userService.updateUserProfile({
                name, 
                email, 
                avatar: "",
                lat: 0,
                lng: 0  
            });
            nameElement.textContent = name;
            emailElement.textContent = email;
            profileForm.classList.add("d-none");
            profileInfo.classList.remove("d-none");
        }
    };
    


    editPasswordBtn.onclick = () => {
        profileInfo.classList.add("d-none");
        passwordForm.classList.remove("d-none");
    };

    cancelEditPasswordBtn.onclick = () => {
        passwordForm.classList.add("d-none");
        profileInfo.classList.remove("d-none");
    };

    passwordForm.onsubmit = async (event) => {
        event.preventDefault();
        const password = (document.getElementById("password") as HTMLInputElement).value;
        const password2 = (document.getElementById("password2") as HTMLInputElement).value;
        if (password && password === password2) {
            await userService.changePassword(password, password2);
            passwordForm.classList.add("d-none");
            profileInfo.classList.remove("d-none");
        } else {
            alert("Passwords do not match");
        }
    };

    photoInput.onchange = async () => {
        if (photoInput.files && photoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64Image = reader.result as string;
                const newAvatarUrl = await userService.updateAvatar(base64Image);
                (document.getElementById("avatar") as HTMLImageElement).src = newAvatarUrl;
            };
            reader.readAsDataURL(photoInput.files[0]);
        }
    };
}

function initMap(coordinates: Coordinates) {
    const mapService = new MapService(coordinates, mapElementId);
    mapService.createMarker(coordinates);
}

loadUserProfile();

document.getElementById("logout")?.addEventListener("click", () => {
    AuthService.logout();
});
