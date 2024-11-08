// AuthService: Servicio para la autenticar usuarios.
// - Implementar métodos para iniciar sesión, registrar usuarios y validar tokens.
// - Métodos a implementar:
//   - login(email: string, password: string): Promesa que retorna el token de autenticación.
//   - register(user: User): Promesa que registra un nuevo usuario.
//   - logout(): Método para cerrar la sesión y eliminar el token de localStorage.
// - Utilizar la clase Http para realizar las solicitudes HTTP al servidor.


import { LOGIN_URL } from "../constants";
import { Http } from "./http";

export class AuthService {
    #http: Http;

    constructor() {
        this.#http = new Http();
    }

    // Método para iniciar sesión y almacenar el token
    async login(email: string, password: string): Promise<string> {
        const data = { email, password };
        const response = await this.#http.post<{ accessToken: string }, typeof data>(LOGIN_URL, data);
        
        // Guardar el token en localStorage
        localStorage.setItem("token", response.accessToken);
        return response.accessToken;
    }

    // Método para cerrar sesión
    logout(): void {
        localStorage.removeItem("token");
    }
}
