<template>
  <div class="container-fluid mt-2" id="search-results">
    <div class="row">
      <div class="col-sm-12 col-md-6 px-1">
        <b-card no-body class="mb-1 card">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.users class="accordion-button">Users</b-button>
          </b-card-header>
          <b-collapse id="users" visible accordion="users-accordion" role="tabpanel" class="color2">
            <b-card-body class="p-0">
              <div
                class="row text-center text-light align-items-center mx-0"
                v-if="!usersResults.length || (usersResults.length == 1 && usersResults[0].userId == loggedUser.userId)"
              >
                <div class="col px-0 color3">
                  <h4 class="my-5 py-auto">No users for searched keyword</h4>
                </div>
              </div>
              <div id="search-users">
                <b-list-group v-if="usersResults.length" class="my-1 px-1">
                  <b-list-group-item
                    id="user-item"
                    class="px-1 text-center my-1 list-item"
                    v-for="item in usersResults"
                    :key="item.userId"
                    v-on:click="chooseUser(item.userId)"
                    v-if="item.userId != loggedUser.userId"
                  >
                    {{ item.displayName }}
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <div class="col-sm-12 col-md-6 px-1">
        <b-card no-body class="mb-1 card">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.games class="accordion-button">Games</b-button>
          </b-card-header>
          <b-collapse id="games" visible accordion="games-accordion" role="tabpanel">
            <b-card-body class="p-0">
              <div class="row text-center text-light align-items-center mx-0" v-if="!gamesResults.length">
                <div class="col px-0 color3">
                  <h4 class="my-5 py-auto">
                    No games for search keyword
                  </h4>
                </div>
              </div>
              <div id="search-games" v-if="gamesResults.length">
                <div class="row text-center align-items-center my-1 mx-1">
                  <div class="col-md-6 my-1 px-1" v-for="game in gamesResults" :key="game.title">
                    <similar-game
                      :imageUrl="game.downloadURL"
                      :title="game.title"
                      :description="game.description"
                      :gameId="game.gameId"
                      :inUserProfile="true"
                    ></similar-game>
                  </div>
                </div>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import Router from "vue-router";
import { mapGetters } from "vuex";
import SimilarGame from "../components/game-details/SimilarGame";
export default {
  name: "SearchResults",
  components: {
    SimilarGame,
  },
  data() {
    return {
      keyword: null,
      usersResults: [],
      gamesResults: [],
    };
  },
  watch: {
    $route(to, from) {
      this.initializeSearch();
    },
    games(val) {
      val.forEach((game) => {
        if (
          game.title.toLowerCase() == this.keyword.toLowerCase() ||
          game.description.toLowerCase().includes(this.keyword.toLowerCase()) ||
          game.keywords.join().toLowerCase().includes(this.keyword.toLowerCase())
        ) {
          this.setGames(game);
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      loggedUser: "user",
      games: "games",
    }),
  },
  created() {
    this.initializeSearch();
  },

  methods: {
    setUsers(data) {
      this.usersResults.push(data);
    },
    setGames(data) {
      this.gamesResults.push(data);
    },
    chooseGame(event) {
      this.$router.push("../../games/" + event.title);
      this.$emit("chooseGame", event);
    },
    chooseUser(userId) {
      this.$router.push("../../user-profile/" + userId);
    },
    initializeSearch() {
      this.usersResults = [];
      this.gamesResults = [];

      this.keyword = this.$route.params.keyword;
      let vm = this;
      db.collection("users")
        .where("displayName", "==", this.keyword)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            vm.setUsers(doc.data());
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
      this.games.forEach((game) => {
        if (
          game.title.toLowerCase() == this.keyword.toLowerCase() ||
          game.description.toLowerCase().includes(this.keyword.toLowerCase()) ||
          game.keywords.join().toLowerCase().includes(this.keyword.toLowerCase())
        ) {
          this.setGames(game);
        }
      });
    },
  },
};
</script>
<style>
#search-users {
  overflow-y: auto;
  max-height: 600px;
  background-color: transparent !important;
}
.list-group {
  background-color: #133b5c !important;
}
#search-games {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;
  width: 100%;
}
.list-item:hover {
  cursor: pointer;
}
.game-tile {
  height: 180px;
  width: 150px;
}
.card {
  background-color: #133b5c !important;
}
#user-item {
  background-color: #1e5f74 !important;
  color: white;
}
.accordion-button {
  background-color: #1d2d50 !important;
}
</style>
