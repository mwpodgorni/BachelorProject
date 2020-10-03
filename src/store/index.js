import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      loggedIn: false,
      data: {
        username: null,
        email: null,
        recentlyPlayed: [],
        suggestions: [],
        friends: [],
      },
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.userId = data.uid;
      state.user.data.displayName = data.displayName;
      state.user.data.email = data.email;
    },
    SET_USER_DATA(state, user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot(function(doc) {
          console.log("Current data: ", doc.data());
          state.user.data.recentlyPlayed = doc.data().recentlyPlayed;
          state.user.data.suggestions = doc.data().suggestions;
          state.user.data.friends = doc.data().friends;
        });
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      // console.log("namestore", user.displayName);
      commit("SET_LOGGED_IN", user != null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit("SET_USER", null);
      }
    },
    fetchUserData({ commit }, user) {
      if (user) {
        commit("SET_USER_DATA", user);
      }
    },
    logout({ commit }) {
      commit("SET_LOGGED_IN", false);
      commit("SET_USER", null);
    },
  },
});
