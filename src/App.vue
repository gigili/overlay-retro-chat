<template>
	<div id="app">
		<section class="message-list" v-if="messages.length">
			<ChatMessage
				v-for="(message, index) in messages"
				:key="index"
				:message="message.text"
				:user-state="message.userState"
				:direction="index % 2 === 0 ? 'left' : 'right'"/>
		</section>
	</div>
</template>

<script lang="ts">
import * as tmi from "tmi.js";
import {Userstate} from "tmi.js";
import {generateEmote} from "@/utils/functions";
import {EmoteSet, ChatMessages} from "@/utils/types";
import ChatMessage from "@/components/ChatMessage.vue";
import Vue from 'vue';

export default Vue.extend({
	name: "App",
	components: {
		ChatMessage,
	},
	mounted() {
		const tmiClient = tmi.client({
			options: {debug: true},
			connection: {
				reconnect: true,
				secure: true
			},
			channels: ['gacbl']
		});

		tmiClient.connect().catch(console.error);

		tmiClient.on("message", (channel: string, userState: Userstate, message: string, self: boolean) => {
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

			this.addMessage({
				text: message,
				userState,
				timestamp: Date.now()
			});
		});
	},
	data() {
		const messages: ChatMessages[] = [];
		return {
			messages
		}
	},
	methods: {
		addMessage(message: ChatMessages) {
			this.messages = this.messages.filter((msg: ChatMessages) => msg.timestamp > (Date.now() - (30 * 1000)))
			this.messages.push(message);

			this.$nextTick(() => {
				window.scrollTo(0, document.body.scrollHeight);
			});
		}
	},
})
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
