import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      loggedIn: false,
      data: {
        displayName: null,
        email: null,
        recentlyPlayed: [],
        suggestions: [],
        friends: [],
        invitations:[]
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
        .onSnapshot(function (doc) {
          // console.log("Current data: ", doc.data());
          state.user.data.recentlyPlayed = doc.data().recentlyPlayed;
          state.user.data.suggestions = doc.data().suggestions;
          state.user.data.friends = doc.data().friends;
          state.user.data.invitations = doc.data().invitations;
        });
    },
    CLEAR_USER(state) {
      state.user.userId = null;
      state.user.loggedIn = false;
      state.user.data.displayName = null;
      state.user.data.email = null;
      state.user.data.recentlyPlayed = [];
      state.user.data.suggestions = [];
      state.user.data.friends = [];
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      // console.log("namestore", user.displayName);
      commit("SET_LOGGED_IN", user != null);
      if (user) {
        commit("SET_USER", {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit("CLEAR_USER");
      }
    },
    fetchUserData({ commit }, user) {
      if (user) {
        commit("SET_USER_DATA", user);
      } else {
        commit("CLEAR_USER");
      }
    },
    check() {
      console.log(this.state.user);
    },
    logout({ commit }) {
      commit("SET_LOGGED_IN", false);
    },
  },
});
