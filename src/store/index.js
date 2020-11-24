import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import { componentsPlugin } from "bootstrap-vue";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      userId: null,
      loggedIn: false,
      email: null,
      data: {
        displayName: null,
        recentlyPlayed: [],
        suggestions: [],
        friends: [],
        favoritedGames: [],
        invitations: [],
      },
    },
    games: [],
    reviews: [],
    game: null,
  },

  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.userId = data.uid;
      state.user.email = data.email;
    },
    SET_USER_DATA(state, user) {
      db.collection("users")
        .doc(user.uid)
        .onSnapshot(function(doc) {
          state.user.data = doc.data();
        });
    },
    CLEAR_USER(state) {
      state.user.userId = null;
      state.user.loggedIn = false;
      state.user.data.displayName = null;
      state.user.email = null;
      state.user.data.recentlyPlayed = [];
      state.user.data.favoritedGames = [];
      state.user.data.suggestions = [];
      state.user.data.friends = [];
    },
    SET_GAMES(state, data) {
      state.games = data;
    },
    SET_REVIEWS(state, data) {
      state.reviews = data;
    },
    SET_GAME(state, data) {
      console.log("Setting game to " + data.title);
      state.game = data;
    },
    ADD_FAVORITED(state, data) {
      state.user.data.favoritedGames.push(data);
    },
  },
  actions: {
    fetchUser({ commit }, user) {
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
    logout({ commit }) {
      commit("SET_LOGGED_IN", false);
    },
    fetchGames({ commit }) {
      var docRef = db.collection("games").doc("games");
      var games = [];
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var data = doc.data();
            console.log("Document data:", data);
            var keys = Object.keys(data);
            keys.forEach(function(key) {
              games.push(data[key]);
            });
          } else {
            console.error("No such document!");
          }
        })
        .catch(function(error) {
          console.error("Error getting document:", error);
        });
      // console.log("Games " + games);
      commit("SET_GAMES", games);
    },
    fetchReviews({ commit }) {
      var docRef = db.collection("reviews").doc("reviews");
      var reviews = [];
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var data = doc.data();
            var keys = Object.keys(data);
            keys.forEach(function(key) {
              reviews.push(data[key]);
            });
          } else {
            console.error("No such document!");
          }
        })
        .catch(function(error) {
          console.error("Error getting document:", error);
        });
      // console.log(reviews);
      commit("SET_REVIEWS", reviews);
    },
    fetchGame({ commit }, gameId) {
      var docRef = db.collection("games").doc("games");
      docRef
        .get()
        .then(function(doc) {
          if (doc.exists) {
            var data = doc.data();
            var keys = Object.keys(data);
            keys.forEach(function(key) {
              if (data[key].gameId == gameId) {
                var game = data[key];
                commit("SET_GAME", game);
              }
            });
          } else {
            console.error("No such game!");
          }
        })
        .catch(function(error) {
          console.error("Error getting game", error);
        });
    },
    addFavorited({ commit }, data) {
      console.log(`Adding ${data.gameId} to favorites for ${data.userId}`);

      db.collection("users")
        .doc(data.userId)
        .update({
          favoritedGames: firebase.firestore.FieldValue.arrayUnion(data.gameId),
        })
        .then(function(doc) {
          console.log(`${data.gameId} added to favorites!`);
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    removeFavorited({ commit }, data) {
      console.log(`Removing ${data.gameId} from favorites for ${data.userId}`);

      db.collection("users")
        .doc(data.userId)
        .update({
          favoritedGames: firebase.firestore.FieldValue.arrayRemove(
            data.gameId
          ),
        })
        .then(function(doc) {
          console.log(`${data.gameId} removed from favorites!`);
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    addReview({ commit }, data) {
      db.collection("reviews")
        .doc("reviews")
        .add(data)
        .then(function(doc) {
          console.log(`Review Added`);
        })
        .catch(function(error) {
          console.log("Error adding review:", error);
        });
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    games(state) {
      return state.games;
    },
    game(state) {
      return state.game;
    },
  },
});
