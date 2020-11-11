import {Userstate} from "tmi.js";

export interface ChatMessages {
	text: string;
	userState: Userstate;
	timestamp: number;
	user: User;
}

export interface EmoteSet {
	emoteId: string;
	emoteImageTag: string;
	emoteUrl: string;
	start: number;
	end: number;
}

export type TwitchAuth = {
	"access_token": string;
	"expires_in": number;
	"scope": string[];
	"token_type": "bearer";
}

export type User = {
	id: string;
	username: string;
	displayName: string;
	profileImage?: string;
	profileImageTimestamp?: number | null;
}

export interface UserStoreState {
	token: string | null;
	users: User[];
}

export type ProfileImageData = {
	profileImage: string | null;
	profileImageTimestamp: number | null;
}
