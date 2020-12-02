<template>
  <div class="container" id="profile">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-2" v-on:click="test()">
          {{ this.user.data.displayName }}
        </h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <router-link to="edit-profile">
          <b-icon class="icon mr-1" icon="pencil-square"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="recentlyPlayed-row">
      <div class="col-sm-12 col-md-6 px-2 color2">
        <b-tabs active-nav-item-class="text-dark" fill class="mt-2">
          <b-tab title="Favorite" active>
            <div class="row text-center align-items-center mx-0 no-activity" v-if="!favoriteGames">
              <div class="col px-0 color3">
                <h4 class="my-auto py-auto">Empty</h4>
              </div>
            </div>
            <!-- <b-list-group id="favorite-list" v-else>
              <b-list-group-item
                class="p-1 list-item"
                v-for="item in user.data.favoriteGames"
                :key="item.gameId"
              >
                <div class="row mx-0" id="recentlyPlayed-item">
                  <div class="col-8 my-auto">
                    <h5 class="my-auto">
                      {{ item.title }}
                    </h5>
                  </div>
                  <div class="col-4 my-auto d-flex justify-content-end">
                    <b-icon
                      v-on:click="viewDetails(item)"
                      v-b-popover.hover.left="'Details'"
                      class="my-auto game-icon"
                      style="width: 25px; height: 25px;"
                      icon="info-square"
                    ></b-icon>
                    <b-icon
                      v-on:click="chooseGame(item)"
                      v-b-popover.hover.left="'Play'"
                      class="my-auto ml-3 game-icon"
                      style="width: 32px; height: 32px;"
                      icon="controller"
                    ></b-icon>
                    <b-icon
                      @click="removeFavorite(item)"
                      v-b-popover.hover.left="'Remove'"
                      class="my-auto ml-3"
                      style="width: 25px; height: 25px;"
                      icon="x-square"
                    ></b-icon>
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group> -->
            <b-container class="favoriteGames" v-else>
              <b-row>
                <b-col class="px-1" sm="12" md="6" v-for="game in favoriteGames" :key="game.gameId">
                  <similar-game
                    id="favorites"
                    :imageUrl="game.downloadURL"
                    :title="game.title"
                    :description="game.description"
                    :gameId="game.gameId"
                    :inProfile="true"
                    @removeClicked="removeFavorite(game)"
                  ></similar-game>
                </b-col>
              </b-row>
            </b-container>
          </b-tab>
          <b-tab title="Recently Played">
            <div class="row text-center align-items-center mx-0 no-activity" v-if="!user.data.recentlyPlayed">
              <div class="col px-0 color3">
                <h4 class="my-auto py-auto">Empty</h4>
              </div>
            </div>
            <b-list-group id="recentlyPlayed-list" v-if="user.data.recentlyPlayed">
              <b-list-group-item class="p-1 list-item" v-for="item in user.data.recentlyPlayed" :key="item.gameId">
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
              </b-list-group-item> </b-list-group
          ></b-tab>
        </b-tabs>
      </div>
      <div class="col-sm-12 col-md-3 px-2 color2">
        <h3 class="mx-auto my-2 text-center">Friends</h3>
        <div class="row text-center align-items-center mx-0 no-activity" v-if="!user.data.friends.length">
          <div class="col px-0 color3">
            <h4 class="my-auto py-auto">Empty</h4>
          </div>
        </div>
        <b-list-group v-else>
          <b-list-group-item class="p-1 list-item" v-for="item in user.data.friends" :key="item.userId">
            <div class="row mx-0" id="recentlyPlayed-item" v-on:click="chooseUser(item.userId)">
              <div class="col my-auto">
                <h5 class="my-auto py-1">{{ item.displayName }}</h5>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-12 col-md-3 px-2 color2">
        <h3 class="mx-auto my-2 text-center">Invitations</h3>
        <div class="row text-center align-items-center mx-0 no-activity" v-if="!user.data.invitations.length">
          <div class="col px-0">
            <h4 class="my-auto py-auto">Empty</h4>
          </div>
        </div>
        <b-list-group id="recentlyPlayed-list" v-else>
          <b-list-group-item class="p-1 list-item" v-for="item in user.data.invitations" :key="item.userId">
            <div class="row mx-0" id="recentlyPlayed-item">
              <div class="col-8 my-auto">
                <h5 class="my-auto">{{ item.displayName }}</h5>
              </div>
              <div class="col-2 my-auto">
                <p class="h5">
                  <b-icon v-on:click="acceptInvitation(item)" class="icon float-right" icon="check2"></b-icon>
                </p>
              </div>
              <div class="col-2 my-auto">
                <p class="h5">
                  <b-icon v-on:click="rejectInvitation(item)" class="icon float-right" icon="x"></b-icon>
                </p>
              </div>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </div>
    <div class="row" id="suggestions-row">
      <div class="col px-0 py-2">
        <h3 class="mx-auto mb-2 py-2 text-center">Suggestions</h3>
        <div class="suggestions-content">
          <div class="py-5 color3" id="no-suggestions" v-if="suggestionsLoadingState == 'notLoading'">
            <h4 class="text-center">Empty</h4>
          </div>
          <div class="text-center py-5" v-if="suggestionsLoadingState == 'loading'">
            <b-spinner class="my-2" label="Loading..." variant="light" type="grow"></b-spinner>
            <h5 class="my-2">Generating Suggestions</h5>
          </div>
          <div
            v-if="suggestionsLoadingState == 'loaded'"
            id="carouselIndicators"
            class="carousel slide"
            data-ride="carousel"
          >
            <div class="carousel-inner">
              <div
                v-for="(suggestion, index) in user.data.suggestions"
                :key="suggestion.gameId"
                v-bind:class="[carouselClass, index === 0 ? carouselActiveClass : '']"
              >
                <img
                  v-on:click="chooseGame(suggestion)"
                  :src="suggestion.downloadURL"
                  style="height: 220px; filter: brightness(80%);"
                  class="d-block mx-auto img-fluid suggestion-image"
                  alt="First slide"
                />
                <div class="carousel-caption d-md-block">
                  <h3>{{ suggestion.title }}</h3>
                  <b-icon
                    v-on:click="viewDetails(suggestion)"
                    v-b-popover.hover.bottom="'Details'"
                    class="my-auto mr-1 game-icon"
                    style="width: 35px; height: 35px;"
                    icon="info-square"
                  ></b-icon>
                  <b-icon
                    v-on:click="chooseGame(suggestion)"
                    v-b-popover.hover.bottom="'Play'"
                    class="my-auto pt-1 ml-1 game-icon"
                    style="width: 40px; height: 40px;"
                    icon="controller"
                  ></b-icon>
                </div>
              </div>
            </div>
            <a
              v-if="user.data.suggestions.length > 1"
              class="carousel-control-prev"
              href="#carouselIndicators"
              role="button"
              data-slide="prev"
            >
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              v-if="user.data.suggestions.length > 1"
              class="carousel-control-next"
              href="#carouselIndicators"
              role="button"
              data-slide="next"
            >
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
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
import SimilarGame from "../components/game-details/SimilarGame";
export default {
  components: { SimilarGame },
  data() {
    return {
      carouselClass: "carousel-item",
      carouselActiveClass: "active",
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
      suggestionsLoadingState: "suggestionsLoadingState",
      games: "games",
    }),
    favoriteGames() {
      let favorites = [];
      this.games.forEach((game) => {
        this.user.data.favoriteGames.forEach((favoriteGame) => {
          if (game.gameId === favoriteGame.gameId) {
            favorites.push(game);
          }
        });
      });
      console.log(favorites);
      return favorites;
    },
  },
  methods: {
    test() {
      console.log("test", this.suggestionsLoadingState);
    },
    viewDetails(game) {
      this.$router.push("games/details/" + game.gameId);
    },
    chooseGame(event) {
      this.$router.push("../../games/" + event.title);
      this.$emit("chooseGame", event);
    },
    removeFavorite(game) {
      this.$store.dispatch("removeFavorite", {
        gameId: game.gameId,
        title: game.title,
        userId: this.user.data.userId,
      });
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
  background-color: #133b5c;
}
#username-row {
  background-color: #1d2d50;
}
#recentlyPlayed-item {
  background-color: #1d2d50;
}
#recentlyPlayed-row,
#suggestions-row {
  background-color: #133b5c;
}
.suggestions-content {
  background-color: #1e5f74;
}
.no-activity {
  height: 300px;
  background-color: #1e5f74;
}
#recentlyPlayed-list,
#favorite-list {
  overflow: auto;
  max-height: 265px;
  background-color: #1e5f74;
}
.suggestion-image {
  cursor: pointer;
}
.favoriteGames {
  overflow-y: scroll;
  height: 300px;
}
</style>
