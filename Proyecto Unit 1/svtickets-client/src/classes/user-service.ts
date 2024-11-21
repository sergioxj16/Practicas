import { USER_PROFILE_URL, UPDATE_AVATAR_URL, UPDATE_PROFILE_URL, UPDATE_PASSWORD_URL, GET_PROFILE_USERS_URL } from "../constants";
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

    async getUserProfileById(userId: string): Promise<User> {
        const response = await this.#http.get<{ user: User }>(`${GET_PROFILE_USERS_URL}/${userId}`);
        return response.user;
    }
    
    async updateUserProfile(name: string, email: string): Promise<void> {
        await this.#http.put(UPDATE_PROFILE_URL, {name: name, email: email});
    }

    async changePassword(newPassword: string): Promise<void> {
        await this.#http.put(UPDATE_PASSWORD_URL, {
            password: newPassword
        });
    }

    async updateAvatar(base64Image: string): Promise<string> {
        const response = await this.#http.put<{ avatar: string }, { avatar: string }>(
            UPDATE_AVATAR_URL, 
            { avatar: base64Image }
        );
        return response.avatar;
    }
    
}

