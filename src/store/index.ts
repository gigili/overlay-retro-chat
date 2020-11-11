import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import UserStore from "@/store/modules/UserStore";

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'gft',
  storage: window.localStorage,
  reducer: (state: any) => ({
    UserStore: state.UserStore,
  }),
})

export default new Vuex.Store({
  plugins: [
    vuexLocalStorage.plugin
  ],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    UserStore
  }
})
