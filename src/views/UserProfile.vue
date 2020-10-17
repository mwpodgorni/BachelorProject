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
                    {{ item.lastPlayed }}
                  </div>
                </div>
              </div>
              <div class="col-3 my-auto">
                <p class="h5">
                  <b-icon
                    v-on:click="chooseGame(item.title.replace(/\s/g, ''))"
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
      recentlyPlayed: [
        {
          title: "Game Title 1",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 2",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 3",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 4",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 5",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 6",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 7",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 8",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 9",
          lastPlayed: "16.04.2020",
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.initializeSearch(vm);
    });
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    chooseUser: function (user) {
      console.log("user profile", user);
    },
    setViewedUser(data) {
      this.viewedUser = data;
      this.checkUsers();
    },
    checkUsers() {
      var invitations = [];
      var friends = [];
      this.viewedUser.invitations.forEach((element) => {
        invitations.push(element.userId);
      });
      this.viewedUser.friends.forEach((element) => {
        friends.push(element.userId);
      });
      if (friends.includes(this.user.userId)) {
        this.displayInviteIcon = false;
        this.displayMessageIcon = true;
      } else {
        if (invitations.includes(this.user.userId)) {
          this.displayInviteIcon = false;
        } else {
          this.displayInviteIcon = true;
        }
        this.displayMessageIcon = false;
      }
    },
    chooseGame(event) {
      // this.$router.push({name:"games", params:{game:event}});
      this.$router.push("../../games/" + event);
      this.$emit("chooseGame", event);
    },
    initializeSearch(vm) {
      var keyword = vm.$route.params.username;
      db.collection("users")
        .doc(keyword)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            vm.setViewedUser(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    },
    sendInvite() {
      var keyword = this.$route.params.username;
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
          this.viewedUser.invitations.push({
            userId: this.user.userId,
            displayName: this.user.data.displayName,
          });
          this.checkUsers();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
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
            this.user.data.friends = this.user.data.friends.filter(
              (element) => element.userId != this.viewedUser.userId
            );
            console.log("Removed from user friends.");
          })
          .catch(function (error) {
            // The document probably doesn't exist.
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
            // The document probably doesn't exist.
            console.error("Error removing from friends: ", error);
          });
        this.checkUsers();
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
            username: this.user.data.displayName,
          }),
        })
        .then(() => {
          this.viewedUser.invitations = this.viewedUser.invitations.filter(
            (element) => element.userId != this.user.userId
          );
          this.checkUsers();
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error removing invitation: ", error);
        });
    },
    openConversation() {
      var keyword = this.$route.params.username;
      this.$router.push("../../chat/" + keyword);
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
