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

            if (!response.accessToken) {
                throw new Error("Login failed: No access token returned");
            }

            localStorage.setItem("token", response.accessToken);
            return response.accessToken;
        } catch (error) {
            if (error && (error as { message: string[] }).message) {
                const errors = (error as { message: string[] }).message;
                throw new Error(errors.join(", "));
            } else if (error && (error as { error: string }).error) {
                throw new Error((error as { error: string }).error);
            } else {
                throw new Error("Login failed with an unknown error.");
            }
        }
    }

    async register(user: User): Promise<void> {
        try {
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


    static async checkAuth(page: "login" | "register" | "other"): Promise<void> {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const http = new Http();
                await http.get(VALIDATE_TOKEN_URL);

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

    static logout(): void {
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}

