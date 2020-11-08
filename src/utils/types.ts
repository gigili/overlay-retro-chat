import {Userstate} from "tmi.js";

export interface ChatMessages  {
	text: string;
	userState: Userstate;
	timestamp: number;
}

export interface EmoteSet {
	emoteId: string;
	emoteImageTag: string;
	emoteUrl: string;
	start: number;
	end: number;
}
