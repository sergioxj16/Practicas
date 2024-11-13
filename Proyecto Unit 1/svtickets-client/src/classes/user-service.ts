// UserService: Servicio para gestionar la información del usuario.
// - Implementar métodos para obtener y actualizar el perfil del usuario.
// - Métodos a implementar:
//   - getUserProfile(): Promesa que obtiene la información del perfil del usuario.
//   - updateUserProfile(user: User): Promesa que actualiza el perfil del usuario en el servidor.
//   - changePassword(oldPassword: string, newPassword: string): Promesa que cambia la contraseña del usuario.
// - Utilizar la clase Http para realizar las solicitudes HTTP al servidor.


import { USER_PROFILE_URL, UPDATE_AVATAR_URL, UPDATE_PROFILE_URL, UPDATE_PASSWORD_URL } from "../constants";
import { Http } from "./http";
import { User } from "../interfaces/user";

export class UserService {   
    #http: Http; 

    constructor() {
        this.#http = new Http();
    };
    
    async getUserProfile(): Promise<User> {
        const response = await this.#http.get<{ user: User }>(USER_PROFILE_URL);
        return response.user;
    }
    
    // Método para actualizar el perfil del usuario
    async updateUserProfile(user: User): Promise<void> {
        await this.#http.put(UPDATE_PROFILE_URL, {
            name: user.name,
            email: user.email
        });
    }

    // Método para cambiar la contraseña del usuario
    async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        await this.#http.put(UPDATE_PASSWORD_URL, {
            password: newPassword
        });
    }

    // Método para actualizar el avatar del usuario
    async updateAvatar(base64Image: string): Promise<string> {
        const response = await this.#http.put<{ user: User }, { avatar: string }>(UPDATE_AVATAR_URL, {
            avatar: base64Image
        });
        return response.user.avatar;
    }
}

