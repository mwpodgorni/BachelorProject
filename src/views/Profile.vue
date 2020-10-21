<template>
  <div class="container" id="profile">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ user.data.displayName }}</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <router-link to="edit-profile">
          <b-icon class="icon mr-1" icon="pencil-square"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="recentlyPlayed-row">
      <div class="col-sm-12 col-md-6 px-2">
        <h3 class="mx-auto my-2 text-center">Recently Played</h3>
        <div
          class="row text-center align-items-center mx-0 no-activity"
          v-if="!user.data.recentlyPlayed.length"
        >
          <div class="col px-0">
            <h4 class="my-auto py-auto">No recent activity</h4>
          </div>
        </div>
        <b-list-group
          id="recentlyPlayed-list"
          v-if="user.data.recentlyPlayed.length"
        >
          <b-list-group-item
            variant="dark"
            class="px-1"
            v-for="item in user.data.recentlyPlayed"
            :key="item.title"
          >
            <div class="row mx-0" id="recentlyPlayed-item">
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

      <div class="col-sm-12 col-md-3 px-2">
        <h3 class="mx-auto my-2 text-center">Friends</h3>
        <div
          class="row text-center align-items-center mx-0 no-activity"
          v-if="!user.data.friends.length"
        >
          <div class="col px-0">
            <h4 class="my-auto py-auto">No friends</h4>
          </div>
        </div>
        <b-list-group id="recentlyPlayed-list" v-if="user.data.friends.length">
          <b-list-group-item
            variant="dark"
            class="px-1"
            v-for="item in user.data.friends"
            :key="item.userId"
          >
            <div class="row mx-0" id="recentlyPlayed-item">
              <div class="col-9 my-auto">
                <h5 class="my-auto">{{ item.displayName }}</h5>
              </div>
              <div class="col-3 my-auto">
                <p class="h4">
                  <b-icon
                    v-on:click="chooseUser(item.userId)"
                    class="icon float-right py-1"
                    icon="arrow-up"
                  ></b-icon>
                </p>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-12 col-md-3 px-2">
        <h3 class="mx-auto my-2 text-center">Invitations</h3>
        <div
          class="row text-center align-items-center mx-0 no-activity"
          v-if="!user.data.invitations.length"
        >
          <div class="col px-0">
            <h4 class="my-auto py-auto">No Invitations</h4>
          </div>
        </div>
        <b-list-group
          id="recentlyPlayed-list"
          v-if="user.data.invitations.length"
        >
          <b-list-group-item
            variant="dark"
            class="px-1"
            v-for="item in user.data.invitations"
            :key="item.userId"
          >
            <div class="row mx-0" id="recentlyPlayed-item">
              <div class="col-8 my-auto">
                <h5 class="my-auto">{{ item.displayName }}</h5>
              </div>
              <div class="col-2 my-auto">
                <p class="h5">
                  <b-icon
                    v-on:click="acceptInvitation(item)"
                    class="icon float-right"
                    icon="check2"
                  ></b-icon>
                </p>
              </div>
              <div class="col-2 my-auto">
                <p class="h5">
                  <b-icon
                    v-on:click="rejectInvitation(item)"
                    class="icon float-right"
                    icon="x"
                  ></b-icon>
                </p>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
    <div class="row" id="suggestions-row">
      <div class="col px-0 py-2">
        <h3 class="mx-auto mb-3 pb-1 text-center">Suggestions</h3>
        <div>
          <div
            class="py-5"
            id="no-suggestions"
            v-if="!user.data.suggestions.length"
          >
            <h4 class="text-center">No suggestions</h4>
          </div>
          <div
            v-if="user.data.suggestions.length"
            id="carouselIndicators"
            class="carousel slide"
            data-ride="carousel"
          >
            <ol class="carousel-indicators">
              <li
                v-for="(suggestionI, index) in user.data.suggestions"
                :key="suggestionI.gameId"
                data-target="#carouselIndicators"
                data-slide-to="index"
                v-bind:class="[index === 0 ? carouselActiveClass : '']"
              ></li>
            </ol>
            <div class="carousel-inner">
              <div
                v-for="(suggestion, index) in user.data.suggestions"
                :key="suggestion.gameId"
                v-bind:class="[
                  carouselClass,
                  index === 0 ? carouselActiveClass : '',
                ]"
              >
                <img
                  v-on:click="chooseGame(suggestion)"
                  :src="suggestion.downloadURL"
                  style="height: 220px;"
                  class="d-block mx-auto img-fluid suggestion-image"
                  alt="First slide"
                />
                <div class="carousel-caption d-md-block">
                  <h5>{{ suggestion.title }}</h5>
                  <p>{{ suggestion.description }}</p>
                </div>
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#carouselIndicators"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#carouselIndicators"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import userData from "@/assets/json-data/user-data.json";
export default {
  components: {},
  data() {
    return {
      userData: userData,
      carouselClass: "carousel-item",
      carouselActiveClass: "active",
    };
  },
  methods: {
    check() {
      // @click.prevent="check"
      this.user.data.suggestions.forEach((element) => {
        console.log("index:", element.index);
      });
    },
    chooseGame(event) {
      // this.$router.push({name:"games", params:{game:event}});
      this.$router.push("../../games/" + event.title.replace(/\s/g, ""));
      this.$emit("chooseGame", event);
    },
    chooseUser(userId) {
      this.$router.push("../../user-profile/" + userId);
    },
    acceptInvitation(userInvite) {
      db.collection("users")
        .doc(this.user.userId)
        .update({
          friends: firebase.firestore.FieldValue.arrayUnion({
            userId: userInvite.userId,
            displayName: userInvite.displayName,
          }),
        })
        .then(() => {
          console.log("Added to friends.");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error adding to friends: ", error);
        });
      db.collection("users")
        .doc(userInvite.userId)
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
          // The document probably doesn't exist.
          console.error("Error adding to user friends: ", error);
        });
      db.collection("users")
        .doc(this.user.userId)
        .update({
          invitations: firebase.firestore.FieldValue.arrayRemove({
            userId: userInvite.userId,
            displayName: userInvite.displayName,
          }),
        })
        .then(() => {
          console.log("Removed invitation");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error removing invitation: ", error);
        });
    },
    rejectInvitation(userInvite) {
      db.collection("users")
        .doc(this.user.userId)
        .update({
          invitations: firebase.firestore.FieldValue.arrayRemove({
            userId: userInvite.userId,
            displayName: userInvite.displayName,
          }),
        })
        .then(() => {
          console.log("Removed invitation");
        })
        .catch(function (error) {
          // The document probably doesn't exist.
          console.error("Error removing invitation: ", error);
        });
    },
  },

  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
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
  background-color: #32383e;
}
#username-row,
#recentlyPlayed-item {
  background-color: #636a70;
}
#recentlyPlayed-row,
#suggestions-row {
  background-color: #32383e;
}
.no-activity {
  height: 265px;
  background-color: #636a70;
}
#recentlyPlayed-list {
  overflow: auto;
  max-height: 265px;
  /* height: 50%; */
}

.suggestion-image {
  cursor: pointer;
}
</style>
