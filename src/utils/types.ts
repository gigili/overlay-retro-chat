import {Userstate} from "tmi.js";

export default interface ChatMessage  {
	text: string;
	userState: Userstate;
	timestamp: number;
}
