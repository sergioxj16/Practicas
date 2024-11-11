import { LOGIN_URL } from "../constants";
import { REGISTER_URL } from "../constants";
import { Http } from "./http";
import { UserLogin } from "../interfaces/user";
import { User } from "../interfaces/user";
import { VALIDATE_TOKEN_URL } from "../constants";

export class AuthService {
    #http: Http;

    constructor() {
        this.#http = new Http();
    }

    async login(userLogin: UserLogin): Promise<string> {
        const data = {
            email: userLogin.email,
            password: userLogin.password,
            lat: userLogin.lat,
            lng: userLogin.lng,
        };

        try {
            const response = await this.#http.post<{ accessToken: string }, typeof data>(LOGIN_URL, data);

            // Validar si la respuesta contiene el token
            if (!response.accessToken) {
                throw new Error("Login failed: No access token returned");
            }

            // Guardamos el token en localStorage
            localStorage.setItem("token", response.accessToken);
            return response.accessToken;
        } catch (error) {
            // Verificamos si el error es un objeto con las propiedades 'message' y 'error'
            if (error && (error as { message: string[] }).message) {
                // Si 'message' es un array, lo extraemos
                const errors = (error as { message: string[] }).message;
                throw new Error(errors.join(", "));
            } else if (error && (error as { error: string }).error) {
                // Si el objeto tiene una propiedad 'error', lo lanzamos como mensaje
                throw new Error((error as { error: string }).error);
            } else {
                throw new Error("Login failed with an unknown error.");
            }
        }
    }

    async register(user: User): Promise<void> {
        try {
            // Enviar el objeto completo de usuario como está
            const response = await this.#http.post<{ message: string[] }, User>(REGISTER_URL, user);

            if (response.message && response.message.length > 0) {
                throw response;
            }
        } catch (error) {
            if (error && (error as { message: string[] }).message) {
                const errors = (error as { message: string[] }).message;
                throw new Error(errors.join(", "));
            } else {
                throw new Error("Registration failed with an unknown error.");
            }
        }
    }


    // Método estático para verificar la validez del token
    static async checkAuth(page: "login" | "register" | "other"): Promise<void> {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const http = new Http();
                await http.get(VALIDATE_TOKEN_URL);

                // Redirigir si el token es válido
                if (page === "login" || page === "register") {
                    window.location.href = "index.html";
                }
            } catch (error) {
                alert("Expired login: " + (error instanceof Error ? error.message : "Unknown error"));
                localStorage.removeItem("token");

                if (page === "other") {
                    window.location.href = "login.html";
                }
            }
        } else {
            if (page === "other") {
                window.location.href = "login.html";
                alert("Expired login.");
            }
        }
    }

    // Método para cerrar sesión, eliminando el token de localStorage
    static logout(): void {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

