import {EmoteSet} from "@/utils/types";

export function generateEmote(emoteId: string, position: string): EmoteSet{
	const [start, end] = position.split('-').map(Number);

	return {
		emoteId,
		emoteImageTag: `<img class='emote' src='https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0'/>`,
		emoteUrl: `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`,
		start,
		end,
	};
}
