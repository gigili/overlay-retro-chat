<template>
	<section class="message" :class="{ '-left' : direction === 'left', '-right': direction === 'right' }">
		<!-- Balloon -->
		<div class="nes-balloon" :class="{'from-left': direction === 'left', 'from-right': direction === 'right'}">
			<p class="message-text" v-html="message"></p>
		</div>
		<div class="fr" :class="{'fr-left': direction === 'left', 'fr-right': direction === 'right'}">
			<img
				class="nes-avatar is-rounded is-large"
				:src="user.profileImage"/> <!--style="image-rendering: pixelated;"-->
			<!--<i class="nes-bcrikko"></i>-->
			<p class="displayName">{{ userState["display-name"] }}</p>
		</div>
	</section>
</template>

<script>
export default {
	props: ["message", "userState", "direction", "user"],
	name: "ChatMessage",
}
</script>

<style scoped>
.message-text {
	word-break: break-word;
}

.message {
	padding: 10px;
	display: flex;
	flex-direction: column;
}

.fr {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.fr-right {
	justify-content: flex-start;
	flex-direction: row-reverse
}

.displayName {
	margin-left: 15px;
	margin-right: 15px;
	font-size: 15px;
}
</style>
