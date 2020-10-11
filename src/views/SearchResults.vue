<template>
  <div class="container-fluid mt-2" id="search-results">
    <div class="row">
      <div class="col-sm-12 col-md-6 px-1">
        <b-card no-body class="mb-1" bg-variant="dark">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.users variant="dark">Users</b-button>
          </b-card-header>
          <b-collapse
            id="users"
            visible
            accordion="users-accordion"
            role="tabpanel"
          >
            <b-card-body class="bg-dark p-0">
              <div
                class="row text-center text-light align-items-center mx-0"
                v-if="
                  !usersResults.length ||
                    (usersResults.length == 1 &&
                      usersResults[0].userId == loggedUser.userId)
                "
              >
                <div class="col px-0">
                  <h4 class="my-5 py-auto">No users for searched keyword</h4>
                </div>
              </div>
              <div id="search-users">
                <b-list-group v-if="usersResults.length" class="my-1 px-1">
                  <b-list-group-item
                    variant="dark"
                    class="px-1 text-center my-1 list-item"
                    v-for="item in usersResults"
                    :key="item.username"
                    v-on:click="chooseUser(item.userId)"
                    v-if="item.userId != loggedUser.userId"
                  >
                    {{ item.username }}
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
      <div class="col-sm-12 col-md-6 px-1">
        <b-card no-body class="mb-1" bg-variant="dark">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.games variant="dark">Games</b-button>
          </b-card-header>
          <b-collapse
            id="games"
            visible
            accordion="games-accordion"
            role="tabpanel"
          >
            <b-card-body class="bg-dark p-0">
              <div
                class="row text-center text-light align-items-center mx-0"
                v-if="!gamesResults.length"
              >
                <div class="col px-0">
                  <h4 class="my-5 py-auto" v-on:click="check">
                    No games for search keyword
                  </h4>
                </div>
              </div>
              <div id="search-games" v-if="gamesResults.length">
                <div class="row text-center align-items-center my-1 mx-1">
                  <div
                    class="col-md-6 my-1 px-1"
                    v-for="game in gamesResults"
                    :key="game.title"
                    v-on:click="chooseGame(game.title.replace(/\s/g, ''))"
                  >
                    <div>
                      <img
                        :src="game.downloadURL"
                        class="img-fluid list-item"
                      />

                      <div class="carousel-caption">
                        <h5>{{ game.title }}</h5>
                      </div>
                    </div>
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
export default {
  name: "SearchResults",
  data() {
    return {
      keyword: null,
      usersResults: [],
      gamesResults: [],
      searchGames: [
        {
          title: "Game Title1",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title2",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title3",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title4",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title5",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title6",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title7",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
        {
          title: "Game Title8",
          source: require("../assets/games/3-square_tower/cover.jpg"),
        },
      ],
      searchUsers: [
        { username: "User1" },
        { username: "User2" },
        { username: "User3" },
        { username: "User4" },
        { username: "User5" },
        { username: "User6" },
        { username: "User7" },
        { username: "User8" },
        { username: "User9" },
        { username: "User10" },
        { username: "User11" },
        { username: "User12" },
        { username: "User13" },
        { username: "User14" },
        { username: "User15" },
        { username: "User16" },
        { username: "User17" },
        { username: "User18" },
        { username: "User19" },
        { username: "User20" },
      ],
    };
  },
  // created () {
  //     this.initializeSearch();
  // },
  watch: {
    $route(to, from) {
      this.initializeSearch(this);
    },
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      loggedUser: "user",
    }),
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.initializeSearch(vm);
    });
    //   console.log("route en")
    //   console.log(to.params);
    //   var keyword = to.params.keyword;
    //   db.collection("users")
    //   .where("username", "==", keyword)
    //   .get()
    //   .then(function (querySnapshot){
    //     console.log("l",querySnapshot.length)
    //     querySnapshot.forEach(function(doc){
    //             console.log("in")
    //     next((vm)=>vm.setUsers(doc.data()));
    //     })
    //         next();
    //     console.log("out")
    //   })
    //   .catch(function (error){
    //     console.log("Error getting documents: ", error);
    //   });
    //   db.collection("games")
    //     .where("title", "==", keyword)
    //     .get()
    //     .then(function (querySnapshot) {
    //       querySnapshot.forEach(function (doc) {
    //         next((vm)=>vm.setGames(doc.data()));
    //         // doc.data() is never undefined for query doc snapshots
    //         // console.log(doc.id, " <=> ", doc.data());

    //       });
    //           next();
    //       console.log("out2")
    //     })
    //     .catch(function (error) {
    //       console.log("Error getting documents: ", error);
    //     });
  },
  methods: {
    check() {
      console.log(this.usersResults[0].userId);
      console.log(this.loggedUser.userId);
    },
    setUsers(data) {
      this.usersResults.push(data);
    },
    setGames(data) {
      this.gamesResults.push(data);
    },
    test() {},
    chooseGame(event) {
      // this.$router.push({name:"games", params:{game:event}});
      this.$router.push("../../games/" + event);
      this.$emit("chooseGame", event);
    },
    chooseUser(userId) {
      this.$router.push("../../user-profile/" + userId);
    },
    initializeSearch(vm) {
      vm.usersResults = [];
      vm.gamesResults = [];
      var keyword = vm.$route.params.keyword;
      db.collection("users")
        .where("username", "==", keyword)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            vm.setUsers(doc.data());
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
      db.collection("games")
        .where("title", "==", keyword)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            vm.setGames(doc.data());
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " <=> ", doc.data());
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
  },
};
</script>
<style>
#search-results {
  /* display: flex; */
  /* flex-flow: column; */
  height: 100%;
  /* overflow-y: hidden; */
  /* background-color: #32383e; */
}
#search-results * {
  /* color: white; */
}
#search-users {
  /* overflow-x: hidden; */
  overflow-y: auto;
  max-height: 600px;
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
  background-color: #636a70;
  /* background-image: url("../assets/games/3-square_tower/cover.jpg"); */
  /* background-size: cover; */
}
#game-tile {
}
</style>
