<template>
  <div class="container pb-1" id="profile" v-if="viewedUser">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ viewedUser.displayName }}</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <b-icon v-if="displayInviteIcon" v-on:click="sendInvite()" class="icon mr-3" icon="person-plus"></b-icon>
        <b-icon v-if="displayRemoveIcon" v-on:click="removeFromFriends()" class="icon mr-3" icon="person-dash"></b-icon>
        <b-icon
          v-if="displayMessageIcon"
          v-on:click="openConversation()"
          class="icon mr-1"
          icon="chat-left-text"
        ></b-icon>
      </div>
    </div>
    <div class="row color2" id="recentlyPlayed-row">
      <div class="col-sm-12 col-md-8 px-2">
        <b-tabs fill active-nav-item-class="text-dark" class="mt-2">
          <b-tab title="Favorites" active style="max-height: 500px; overflow-y: auto; overflow-x: hidden;">
            <div class="row text-center align-items-center mx-0" id="no-activity" v-if="!favoriteGames.length">
              <div class="col px-0">
                <h4 class="my-auto py-auto">Empty</h4>
              </div>
            </div>
            <div>
              <b-row>
                <b-col sm="12" md="6" v-for="game in favoriteGames" :key="game.gameId">
                  <similar-game
                    id="favorites"
                    :imageUrl="game.downloadURL"
                    :title="game.title"
                    :description="game.description"
                    :gameId="game.gameId"
                    :inUserProfile="true"
                  ></similar-game>
                </b-col>
              </b-row>
            </div>
          </b-tab>
          <b-tab title="Recently played">
            <div
              class="row text-center align-items-center mx-0"
              id="no-activity"
              v-if="!viewedUser.recentlyPlayed.length"
            >
              <div class="col px-0">
                <h4 class="my-auto py-auto">No recent activity</h4>
              </div>
            </div>
            <b-list-group id="recentlyPlayedUser-list" v-if="viewedUser.recentlyPlayed.length">
              <b-list-group-item
                class="px-1 py-1 list-item"
                v-for="item in viewedUser.recentlyPlayed"
                :key="item.title"
              >
                <div class="row mx-0" id="recentlyPlayed-item">
                  <div class="col-8">
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0 my-auto">
                        <h5 class="my-auto">{{ item.title }}</h5>
                      </div>
                    </div>
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                        <p class="m-0">
                          Last played on:
                          {{ item.lastPlayed.toDate().toLocaleDateString("en-US") }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="col-4 my-auto d-flex justify-content-end">
                    <b-icon
                      v-on:click="viewDetails(item)"
                      v-b-popover.hover.left="'Details'"
                      class="my-auto game-icon"
                      style="width: 30px; height: 30px;"
                      icon="info-square"
                    ></b-icon>
                    <b-icon
                      v-on:click="chooseGame(item)"
                      v-b-popover.hover.left="'Play'"
                      class="my-auto ml-3 game-icon"
                      style="width: 30px; height: 30px;"
                      icon="controller"
                    ></b-icon>
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>
          </b-tab>
        </b-tabs>
      </div>
      <div class="col-sm-12 col-md-4">
        <h3 class="mx-auto my-2 text-center">Friends</h3>
        <b-list-group class="p-0 m-0">
          <b-list-group-item
            class="p-1 list-item"
            v-for="friend in viewedUser.friends"
            :key="friend.userId"
            @click="goToProfile(friend.userId)"
          >
            <div class="row mx-0" id="recentlyPlayed-item">
              <div class="col my-auto">
                <h5 class="my-auto py-1">{{ friend.displayName }}</h5>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import SimilarGame from "../components/game-details/SimilarGame";
export default {
  name: "UserProfile",
  components: {
    SimilarGame,
  },
  data() {
    return {
      viewedUser: null,
      displayInviteIcon: false,
      displayRemoveIcon: false,
      displayMessageIcon: false,
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      games: "games",
    }),
    favoriteGames() {
      var favorites = [];
      this.games.forEach((game) => {
        this.viewedUser.favoriteGames.forEach((favoriteGame) => {
          if (game.gameId === favoriteGame.gameId) {
            favorites.push(game);
          }
        });
      });
      return favorites;
    },
  },
  created() {
    this.initializeUserProfile(this.$route);
    this.listenForUpdates(this.$route, this.user);
  },
  watch: {
    $route(newRoute) {
      this.initializeUserProfile(newRoute);
      this.listenForUpdates(newRoute, this.user);
    },
  },
  methods: {
    viewDetails(game) {
      this.$router.push("../../games/details/" + game.gameId);
    },
    initializeUserProfile(route) {
      var keyword = route.params.username;
      var that = this;
      db.collection("users")
        .doc(keyword)
        .onSnapshot(function (doc) {
          that.viewedUser = doc.data();
        });
    },
    goToProfile(userId) {
      this.$router.push(`./${userId}`);
    },
    listenForUpdates(route, user) {
      var keyword = route.params.username;
      var that = this;
      db.collection("users")
        .doc(keyword)
        .onSnapshot(function (doc) {
          var invitations = [];
          var friends = [];
          if (user.loggedIn) {
            if (that.viewedUser) {
              that.viewedUser.invitations.forEach((element) => {
                invitations.push(element.userId);
              });
              that.viewedUser.friends.forEach((element) => {
                friends.push(element.userId);
              });
              if (friends.includes(that.user.userId)) {
                that.displayInviteIcon = false;
                that.displayRemoveIcon = true;
                that.displayMessageIcon = true;
              } else {
                if (invitations.includes(that.user.userId)) {
                  that.displayInviteIcon = false;
                  that.displayRemoveIcon = true;
                } else {
                  that.displayInviteIcon = true;
                  that.displayRemoveIcon = false;
                }
                that.displayMessageIcon = false;
              }
            }
          } else {
            that.displayInviteIcon = false;
            that.displayRemoveIcon = false;
            that.displayMessageIcon = false;
          }
        });
    },
    chooseGame(event) {
      this.$router.push("../../games/" + event.title);
      this.$emit("chooseGame", event);
    },
    sendInvite() {
      var keyword = this.$route.params.username;
      var invitations = [];
      this.user.data.invitations.forEach((element) => {
        invitations.push(element.userId);
      });
      if (invitations.includes(this.viewedUser.userId)) {
        db.collection("users")
          .doc(this.user.userId)
          .update({
            friends: firebase.firestore.FieldValue.arrayUnion({
              userId: this.viewedUser.userId,
              displayName: this.viewedUser.displayName,
            }),
          })
          .then(() => {
            console.log("Added to friends.");
          })
          .catch(function (error) {
            console.error("Error adding to friends: ", error);
          });
        db.collection("users")
          .doc(this.viewedUser.userId)
          .update({
            friends: firebase.firestore.FieldValue.arrayUnion({
              userId: this.user.userId,
              displayName: this.user.data.displayName,
            }),
          })
          .then(() => {
            console.log("Added to user friends.");
          })
          .catch(function (error) {
            console.error("Error adding to user friends: ", error);
          });
        var invitations = [];
        this.user.data.invitations.forEach((element) => {
          invitations.push(element.userId);
        });
        if (invitations.includes(this.viewedUser.userId)) {
          db.collection("users")
            .doc(this.user.userId)
            .update({
              invitations: firebase.firestore.FieldValue.arrayRemove({
                userId: this.viewedUser.userId,
                displayName: this.viewedUser.displayName,
              }),
            })
            .then(() => {
              console.log("removed invitation from user account");
            })
            .catch(function (error) {
              console.error("Error removing invitation: ", error);
            });
        }
      } else {
        db.collection("users")
          .doc(keyword)
          .update({
            invitations: firebase.firestore.FieldValue.arrayUnion({
              userId: this.user.userId,
              displayName: this.user.data.displayName,
            }),
          })
          .then(() => {
            console.log("Document successfully updated!");
          })
          .catch(function (error) {
            console.error("Error updating document: ", error);
          });
      }
    },
    removeFromFriends() {
      var keyword = this.$route.params.username;
      var friends = [];
      this.viewedUser.friends.forEach((element) => {
        friends.push(element.userId);
      });
      if (friends.includes(this.user.userId)) {
        db.collection("users")
          .doc(this.user.userId)
          .update({
            friends: firebase.firestore.FieldValue.arrayRemove({
              userId: this.viewedUser.userId,
              displayName: this.viewedUser.displayName,
            }),
          })
          .then(() => {
            console.log("Removed from user friends.");
          })
          .catch(function (error) {
            console.error("Error removing from user friends: ", error);
          });
        db.collection("users")
          .doc(this.viewedUser.userId)
          .update({
            friends: firebase.firestore.FieldValue.arrayRemove({
              userId: this.user.userId,
              displayName: this.user.data.displayName,
            }),
          })
          .then(() => {
            this.viewedUser.friends = this.viewedUser.friends.filter((element) => element.userId != this.user.userId);
            console.log("removed from friends.");
          })
          .catch(function (error) {
            console.error("Error removing from friends: ", error);
          });
      } else {
        this.removeInvitation();
      }
    },
    removeInvitation() {
      var keyword = this.$route.params.username;
      db.collection("users")
        .doc(keyword)
        .update({
          invitations: firebase.firestore.FieldValue.arrayRemove({
            userId: this.user.userId,
            displayName: this.user.data.displayName,
          }),
        })
        .then(() => {
          console.log("removed invitation from viewed user account");
        })
        .catch(function (error) {
          console.error("Error removing invitation: ", error);
        });
    },
    openConversation() {
      var createConversation = true;
      var vueInstance = this;
      db.collection("conversations")
        .where("participants", "array-contains", this.user.userId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function (doc) {
            if (doc.data().participants.includes(vueInstance.viewedUser.userId)) {
              createConversation = false;
            } else {
            }
          });
          if (createConversation) {
            let docId = db.collection("conversations").doc().id;
            db.collection("conversations")
              .doc(docId)
              .set({
                conversationId: docId,
                createdAt: new Date(),
                creatorId: this.user.userId,
                messages: [],
                usernames: [this.user.data.displayName, this.viewedUser.displayName],
                participants: [this.user.userId, this.viewedUser.userId],
              })
              .then(function () {
                console.log("Document successfully written!");
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              });
          }
        });
      var keyword = this.$route.params.username;
      const path = `/chat/${keyword}`;
      if (this.$route.path !== path) this.$router.push(path);
    },
  },
};
</script>
<style>
#profile * {
  color: white;
}
#profile {
  display: flex;
  flex-flow: column;
  height: 100%;
}
#username-row,
#recentlyPlayedUser-item {
  background-color: #1e5f74;
}
#no-activity {
  height: 270px;
  background-color: #1e5f74;
}
#recentlyPlayedUser-list {
  overflow-y: auto;
  flex-grow: 1;
  height: 550px;
}
.icon {
  cursor: pointer;
}
.list-item {
  background-color: #1e5f74 !important;
}
.list-item:hover {
  background-color: #1d2d50 !important;
}
</style>
