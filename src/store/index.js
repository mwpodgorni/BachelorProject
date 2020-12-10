import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";
import Recommendations from "../recommender/recommendations";
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
        favoriteGames: [],
        invitations: [],
      },
    },
    error: null,
    suggestionsLoadingState: "notLoading",
    gamesLoadingState: "notLoading",
    reviewsLoadingState: "notLoading",
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
    SET_USER_DATA(state, data) {
      state.user.data = data;
    },
    SET_ERROR(state, data) {
      state.error = data;
    },
    CLEAR_USER(state) {
      state.user.userId = null;
      state.user.loggedIn = false;
      state.user.data.displayName = null;
      state.user.email = null;
      state.user.data.recentlyPlayed = [];
      state.user.data.favoriteGames = [];
      state.user.data.suggestions = [];
      state.user.data.friends = [];
    },
    SET_GAMES(state, data) {
      state.games = data;
    },
    SET_GAMES_LOADING_STATUS(state, status) {
      state.gamesLoadingState = status;
    },
    SET_REVIEWS(state, data) {
      state.reviews = data;
    },
    ADD_REVIEW(state, data) {
      console.log("VIBE CHECK");
      state.reviews.push(data);
      state.reviewsLoadingState = "loaded";
    },
    SET_REVIEWS_LOADING_STATUS(state, status) {
      state.reviewsLoadingState = status;
    },
    SET_GAME(state, data) {
      console.log("Setting game to " + data.title);
      state.game = data;
    },
    ADD_FAVORITED(state, data) {
      state.user.data.favoriteGames.push(data);
    },

    GENERATE_SUGGESTIONS(state) {
      state.suggestionsLoadingState = "loading";
      state.user.data.suggestions = [];
      Recommendations(state.user.data, state.games).then(() => {
        // console.log(state.user.data.suggestions.length);
        if (state.user.data.suggestions.length) {
          state.suggestionsLoadingState = "loaded";
        } else {
          state.suggestionsLoadingState = "notLoading";
        }
      });
    },
    SET_SUGGESTIONS_LOADING_STATUS(state, status) {
      state.suggestionsLoadingState = status;
    },
  },
  actions: {
    authAction({ commit }) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          commit("SET_USER", user);
        } else {
          commit("SET_USER", null);
        }
      });
    },
    signUp({ commit }, user) {
      console.log(
        `Creating user: ${user.email} , ${user.password}, ${user.username}`
      );
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          res.user
            .updateProfile({
              displayName: user.username,
            })
            .then(() => {
              db.collection("users")
                .doc(res.user.uid)
                .set({
                  userId: res.user.uid,
                  displayName: user.username,
                  recentlyPlayed: [],
                  suggestions: [],
                  friends: [],
                  favoriteGames: [],
                  invitations: [],
                });
            });
        })
        .catch((error) => {
          console.log("err", error);
          commit("SET_ERROR", error.message);
        });
    },
    signIn({ commit }, payload) {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .catch((error) => {
          commit("SET_ERROR", error.message);
        });
    },
    signOut({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit("SET_USER", null);
        })
        .catch((error) => {
          commit("SET_ERROR", error.message);
        });
    },
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
        db.collection("users")
          .doc(user.uid)
          .onSnapshot(function (doc) {
            if (doc.data()) {
              console.log(doc.data());

              commit("SET_USER_DATA", doc.data());
              commit("GENERATE_SUGGESTIONS");
            }
          });
      } else {
        commit("CLEAR_USER");
      }
    },
    logout({ commit }) {
      commit("SET_LOGGED_IN", false);
    },
    fetchGames({ commit }) {
      // commit("SET_SUGGESTIONS_LOADING_STATUS", "loading");
      commit("SET_GAMES_LOADING_STATUS", "loading");
      var docRef = db.collection("games").doc("games");
      var games = [];
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            var data = doc.data();
            console.log("Document data:", data);
            var keys = Object.keys(data);
            keys.forEach(function (key) {
              games.push(data[key]);
            });
            commit("SET_GAMES", games);
            commit("SET_GAMES_LOADING_STATUS", "loaded");
            commit("GENERATE_SUGGESTIONS");
          } else {
            commit("SET_SUGGESTIONS_LOADING_STATUS", "notLoading");
            commit("SET_GAMES_LOADING_STATUS", "notLoading");
            console.error("No such document!");
          }
        })
        .catch(function (error) {
          console.error("Error getting document:", error);
        });
    },
    fetchReviews({ commit }, gameId) {
      commit("SET_REVIEWS_LOADING_STATUS", "loading");
      db.collection("reviews")
        .doc(gameId)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            if (doc.data().reviews.length) {
              console.log("tes");
              commit("SET_REVIEWS", doc.data().reviews);
              commit("SET_REVIEWS_LOADING_STATUS", "loaded");
            } else {
              commit("SET_REVIEWS_LOADING_STATUS", "notLoading");
              commit("SET_REVIEWS", []);
            }
          } else {
            console.log("No such document!");
            commit("SET_REVIEWS_LOADING_STATUS", "notLoading");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },

    fetchGame({ commit }, gameId) {
      var docRef = db.collection("games").doc("games");
      docRef
        .get()
        .then(function (doc) {
          if (doc.exists) {
            var data = doc.data();
            var keys = Object.keys(data);
            keys.forEach(function (key) {
              if (data[key].gameId == gameId) {
                var game = data[key];
                commit("SET_GAME", game);
              }
            });
          } else {
            console.error("No such game!");
          }
        })
        .catch(function (error) {
          console.error("Error getting game", error);
        });
    },
    addFavorite({ commit }, data) {
      db.collection("users")
        .doc(data.userId)
        .update({
          favoriteGames: firebase.firestore.FieldValue.arrayUnion({
            title: data.title,
            gameId: data.gameId,
          }),
        })
        .then(function (doc) {
          console.log(`${data.gameId} added to favorites!`);
          commit("GENERATE_SUGGESTIONS");
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },

    removeFavorite({ commit }, data) {
      db.collection("users")
        .doc(data.userId)
        .update({
          favoriteGames: firebase.firestore.FieldValue.arrayRemove({
            title: data.title,
            gameId: data.gameId,
          }),
        })
        .then(function (doc) {
          console.log(`${data.gameId} removed from favorites!`);
          commit("GENERATE_SUGGESTIONS");
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },
    addRecentlyPlayed({ commit }, game) {
      let vm = this;
      if (this.state.user.loggedIn) {
        this.state.user.data.recentlyPlayed.forEach((element) => {
          if (element.gameId == game.gameId) {
            db.collection("users")
              .doc(this.state.user.userId)
              .update({
                recentlyPlayed: firebase.firestore.FieldValue.arrayRemove({
                  gameId: element.gameId,
                  lastPlayed: element.lastPlayed,
                  title: element.title,
                }),
              })
              .then(function (doc) {
                console.log("removed from recently Played");
              })
              .catch(function (error) {
                console.log("Error getting document:", error);
              });
          }
        });
        db.collection("users")
          .doc(this.state.user.userId)
          .update({
            recentlyPlayed: firebase.firestore.FieldValue.arrayUnion({
              gameId: game.gameId,
              lastPlayed: new Date(),
              title: game.title,
            }),
          })
          .then(function (doc) {
            console.log("added to recently Played");
            commit("GENERATE_SUGGESTIONS");
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      }
    },
    refreshSuggestions({ commit }) {
      commit("GENERATE_SUGGESTIONS");
    },
    addReview({ commit }, data) {
      commit("ADD_REVIEW", data);
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
    reviews(state) {
      return state.reviews;
    },
    suggestionsLoadingState(state) {
      return state.suggestionsLoadingState;
    },
    gamesLoadingState(state) {
      return state.gamesLoadingState;
    },
    reviewsLoadingState(state) {
      return state.reviewsLoadingState;
    },
  },
});
