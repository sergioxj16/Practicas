export const SERVER = 'https://api.fullstackpro.es/svtickets';

export const LOGIN_URL = SERVER + "/auth/login";
export const REGISTER_URL = SERVER + "/auth/register";
export const EVENTS_URL = SERVER + "/events";
export const USER_PROFILE_URL = SERVER + "/users/me";
export const GET_PROFILE_USERS_URL = SERVER + "/users";
export const VALIDATE_TOKEN_URL = SERVER + "/auth/validate";
export const UPDATE_AVATAR_URL = SERVER + "/users/me/photo";
export const UPDATE_PROFILE_URL = SERVER + "/users/me";
export const UPDATE_PASSWORD_URL = SERVER + "/users/me/password";


//End points
export const EVENT_DETAIL_URL = (eventId: number) => `${SERVER}/events/${eventId}`;
export const EVENT_ATTEND_URL = (eventId: number) => `${SERVER}/events/${eventId}/attend`;
export const DELETE_EVENT_URL = (eventId: number) => `${SERVER}/events/${eventId}`;
