<template>
	<div id="app">
		<section class="message-list" v-if="messages.length">
			<ChatMessage
				v-for="(message, index) in messages"
				:key="index"
				:message="message.text"
				:user-state="message.userState"
				:user="message.user"
				:direction="index % 2 === 0 ? 'left' : 'right'"/>
		</section>
	</div>
</template>

<script lang="ts">
import * as tmi from "tmi.js";
import {Userstate} from "tmi.js";
import {generateEmote} from "@/utils/functions";
import {EmoteSet, ChatMessages, User} from "@/utils/types";
import ChatMessage from "@/components/ChatMessage.vue";
import axios from 'axios';
import {mapGetters, mapMutations} from "vuex";
import {getTwitchToken} from "@/utils/twitchAuth";


const Vue = require("vue").default;

export default Vue.extend({
	name: "App",
	components: {
		ChatMessage,
	},
	async mounted() {
		this.getTokenData();
		const tmiClient = tmi.client({
			options: {debug: true},
			connection: {
				reconnect: true,
				secure: true
			},
			channels: ['gacbl']
		});

		tmiClient.connect().catch(console.error);

		tmiClient.on("message", async (channel: string, userState: Userstate, message: string, self: boolean) => {
			if (self) return;
			if (message.startsWith("!")) return;

			let tempMessage = message;
			// If the message has emotes, modify message to include img tags to the emote
			if (userState.emotes) {
				const emoteSet: EmoteSet[] = [];
				for (const emote of Object.keys(userState.emotes)) {
					const emoteLocations = userState.emotes[emote];
					emoteLocations.forEach((location) => {
						emoteSet.push(generateEmote(emote, location));
					});
				}

				emoteSet.sort((a, b) => {
					return b.end - a.end;
				});

				emoteSet.forEach((emote) => {
					let emoteMessage = tempMessage.slice(0, emote.start);
					emoteMessage += emote.emoteImageTag;
					emoteMessage += tempMessage.slice(emote.end + 1, tempMessage.length);
					tempMessage = emoteMessage;
				});

				message = tempMessage;
			}

			const user: User = {
				id: "",
				username: userState.username,
				displayName: userState["display-name"] || ""
			}

			user.profileImage = await this.getProfileImage(userState);
			user.profileImageTimestamp = Date.now();

			//@ts-ignore
			this.addUser(user);

			this.addMessage({
				text: message,
				userState,
				timestamp: Date.now(),
				user
			});
		});
	},
	data(): { messages: ChatMessages[]; tkn: string } {
		const messages: ChatMessages[] = [];
		return {
			messages: messages,
			tkn: ""
		}
	},
	computed: {
		...mapGetters("UserStore", ["getToken", "getImageUrl"]),
	},
	methods: {
		...mapMutations("UserStore", ["setToken", "setProfileImage", "addUser"]),
		addMessage(message: ChatMessages): void {
			//@ts-ignore
			this.messages = this.messages.filter((msg: ChatMessages) => msg.timestamp > (Date.now() - (30 * 1000)))

			//@ts-ignore
			if (this.messages.length > 0 && this.messages[this.messages.length - 1].userState.username === message.userState.username) {
				//@ts-ignore
				this.messages[this.messages.length - 1].text += '<br/><br/><hr/><br/>' + message.text
			} else {
				//@ts-ignore
				this.messages.push(message);
			}

			//@ts-ignore
			this.$nextTick(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});
		},

		removeOldMessages() {
			//@ts-ignore
			this.messages = this.messages.filter((msg: ChatMessages) => msg.timestamp > (Date.now() - (30 * 1000)))
		},

		getTokenData(): void {
			//@ts-ignore
			const token = this.getToken;
			if (token !== null) {
				//@ts-ignore
				this.tkn = token;
				return token;
			}

			getTwitchToken().then(token => {
				//@ts-ignore
				this.tkn = token
				//@ts-ignore
				this.setToken(token);
			});
		},

		async getProfileImage(user: Userstate): Promise<string> {
			//@ts-ignore
			const url = this.getImageUrl(user);
			if (url !== null && url !== undefined && url.length > 0) return url.profileImage;

			return await axios.get(`https://api.twitch.tv/helix/users?login=${user.username}&client_id=${process.env.VUE_APP_CLIENT_ID}`, {
				headers: {
					//@ts-ignore
					Authorization: `Bearer ${this.tkn}`,
					'Client-Id': process.env.VUE_APP_CLIENT_ID
				}
			}).then(({data}) => {
				//@ts-ignore
				this.setProfileImage({
					username: user.username,
					profileImage: data.data[0]["profile_image_url"]
				});

				return data.data[0]["profile_image_url"];
			}).catch(err => {
				console.error(err.response);
				return "";
			});
		}
	},
});

</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-size: 20px;
	line-height: 1;
	font-family: 'Press Start 2P', Arial, sans-serif;
}
</style>
