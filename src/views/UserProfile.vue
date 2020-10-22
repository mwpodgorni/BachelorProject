<template>
  <div class="container" id="profile" v-if="viewedUser">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ viewedUser.displayName }}</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <b-icon
          v-if="displayInviteIcon"
          v-on:click="sendInvite()"
          class="icon mr-3"
          icon="person-plus"
        ></b-icon>
        <b-icon
          v-if="!displayInviteIcon"
          v-on:click="removeFromFriends()"
          class="icon mr-3"
          icon="person-dash"
        ></b-icon>
        <b-icon
          v-if="displayMessageIcon"
          v-on:click="openConversation()"
          class="icon mr-1"
          icon="chat-left-text"
        ></b-icon>
      </div>
    </div>
    <div class="row" id="recentlyPlayedUser-row">
      <div class="col px-0">
        <h3 class="mx-auto my-2 text-center">Recently Played</h3>
        <div
          class="row text-center align-items-center mx-0"
          id="no-activity"
          v-if="!viewedUser.recentlyPlayed.length"
        >
          <div class="col px-0">
            <h4 class="my-auto py-auto">No recent activity</h4>
          </div>
        </div>
        <b-list-group
          id="recentlyPlayedUser-list"
          v-if="viewedUser.recentlyPlayed.length"
        >
          <b-list-group-item
            variant="dark"
            class="px-1"
            v-for="item in viewedUser.recentlyPlayed"
            :key="item.title"
          >
            <div class="row mx-0" id="recentlyPlayedUser-item">
              <div class="col-9">
                <div class="row m-0 p-0">
                  <div class="col m-0 p-0">{{ item.title }}</div>
                </div>
                <div class="row m-0 p-0">
                  <div class="col m-0 p-0">
                    Last played on:
                    {{ item.lastPlayed.toDate().toLocaleDateString("en-US") }}
                  </div>
                </div>
              </div>
              <div class="col-3 my-auto">
                <p class="h5">
                  <b-icon
                    v-on:click="chooseGame(item)"
                    class="icon float-right"
                    icon="arrow-up"
                  ></b-icon>
                </p>
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
export default {
  name: "UserProfile",
  data() {
    return {
      viewedUser: null,
      displayInviteIcon: false,
      displayMessageIcon: false,
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.initializeUserProfile(vm);
      vm.listenForUpdates(vm);
    });
  },
  methods: {
    initializeUserProfile(vm) {
      var keyword = vm.$route.params.username;
      db.collection("users")
        .doc(keyword)
        .onSnapshot(function (doc) {
          vm.viewedUser = doc.data();
        });
    },
    listenForUpdates(vm) {
      var keyword = vm.$route.params.username;
      db.collection("users")
        .doc(keyword)
        .onSnapshot(function (doc) {
          var invitations = [];
          var friends = [];
          if (vm.viewedUser) {
            vm.viewedUser.invitations.forEach((element) => {
              invitations.push(element.userId);
            });
            vm.viewedUser.friends.forEach((element) => {
              friends.push(element.userId);
            });
            if (friends.includes(vm.user.userId) && vm.user.loggedIn) {
              vm.displayInviteIcon = false;
              vm.displayMessageIcon = true;
            } else {
              if (invitations.includes(vm.user.userId) && vm.user.loggedIn) {
                vm.displayInviteIcon = false;
              } else {
                vm.displayInviteIcon = true;
              }
              vm.displayMessageIcon = false;
            }
          }
        });
    },
    chooseGame(event) {
      // this.$router.push({name:"games", params:{game:event}});
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
            this.viewedUser.friends = this.viewedUser.friends.filter(
              (element) => element.userId != this.user.userId
            );
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
            if (
              doc.data().participants.includes(vueInstance.viewedUser.userId)
            ) {
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
                usernames: [
                  this.user.data.displayName,
                  this.viewedUser.displayName,
                ],
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
      // this.$router.push("../../chat/" + keyword);
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
  background-color: #636a70;
}
#recentlyPlayedUser-row {
  background-color: #32383e;
}
#no-activity {
  height: 270px;
  background-color: #636a70;
}
#recentlyPlayedUser-list {
  overflow-y: auto;
  flex-grow: 1;
  height: 550px;
}
.icon {
  cursor: pointer;
}
</style>
