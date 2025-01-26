import { MyEvent, Comment } from "./myevent";
import { User } from "./user";

export interface EventsResponse {
    events: MyEvent[];
    more: boolean;
    page: number;
    count: number;
}

export interface SingleEventResponse {
    event: MyEvent;
}

export interface TokenResponse {
    accessToken: string;
}

export interface SingleUserResponse {
    user: User;
}

export interface AvatarResponse {
    avatar: string;
}

export interface UsersResponse {
    users: User[];
}

export interface CommentsResponses {
    comments: Comment[];
}

export interface CommentResponse {
    comment: Comment;
}

export interface AttendeesResponse { 
    attendees: User[];
}