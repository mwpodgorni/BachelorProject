import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isNavOpen: false,
    user: {
      loggedIn: false,
      data: null,
    },
  },
  getters: {
    isNavOpen(state) {
      return state.isNavOpen;
    },
    user(state) {
      return state.user;
    },
  },
  mutations: {
    setIsNavOpen(yesno) {
      store.isNavOpen = yesno;
    },
    toggleNav(state) {
      state.isNavOpen = !state.isNavOpen;
    },
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
  },
  actions: {
    toggleNav({ commit }) {
      commit("toggleNav");
    },
    fetchUser({ commit }, user) {
      // console.log("cc", commit);
      commit("SET_LOGGED_IN", user !== null);

      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit("SET_USER", null);
      }
    },
  },
});
