import axios from 'axios';
import {TwitchAuth} from "./types";

const clientSecret = process.env.VUE_APP_CLIENT_SECRET;
const clientID = process.env.VUE_APP_CLIENT_ID;

let token = null;

export function getTwitchToken(): Promise<string> {
	return axios.post(`https://id.twitch.tv/oauth2/token?scope=user:read:email&response_type=token&client_secret=${clientSecret}&grant_type=client_credentials&client_id=${clientID}`, {
		headers: {'Accept': 'application/vnd.twitchtv.v5+json'}
	}).then(response => {
		token = (response.data as TwitchAuth).access_token;
		return token;
	}).catch(error => {
		console.error("[ERROR] Failed twitch auth", error.response.data);
		return "";
	});
}
