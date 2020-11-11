import {ProfileImageData, User, UserStoreState} from "@/utils/types";
import {Userstate} from "tmi.js";

const UserStore = {
	namespaced: true,
	state: {
		token: null,
		users: [],
	} as UserStoreState,
	getters: {
		users(state: UserStoreState): User[] {
			return state.users;
		},
		user(state: UserStoreState, user: User): User | null {
			const data = state.users.filter(usr => usr.username === user.username);
			return data[0] || null;
		},
		getToken(state: UserStoreState): string | null {
			return state.token;
		},
		getImageUrl: (state: UserStoreState) => (usr: Userstate): ProfileImageData | null => {
			const data = state.users.filter(user => user.username === usr.username);
			if (data.length === 0 || !data[0].profileImage ) return null;

			return {
				profileImage: data[0].profileImage || null,
				profileImageTimestamp: data[0].profileImageTimestamp || null
			};
		}
	},
	mutations: {
		addUser(state: UserStoreState, user: User) {
			if(state.users.findIndex(usr => usr.username === user.username) === -1) {
				state.users.push(user);
			}
		},

		setToken(state: UserStoreState, token: string) {
			state.token = token;
		},
		setProfileImage(state: UserStoreState, {username, profileImage}: { username: string; profileImage: string }) {
			const index = state.users.findIndex(usr => usr.username === username);
			if (index !== -1) {
				state.users[index].profileImage = profileImage;
			}
		}
	}
}

export default UserStore;
