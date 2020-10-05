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
              <div class="row text-center align-items-center mx-0" v-if="false">
                <div class="col px-0">
                  <h4 class="my-auto py-auto">No users for search keyword</h4>
                </div>
              </div>
              <div id="search-users">
                <b-list-group v-if="true" class="my-1">
                  <b-list-group-item
                    to="user-profile"
                    variant="dark"
                    class="mx-1 text-center my-1"
                    v-for="item in searchUsers"
                    :key="item.username"
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
              <div class="row text-center align-items-center mx-0" v-if="false">
                <div class="col px-0">
                  <h4 class="my-auto py-auto">No games for search keyword</h4>
                </div>
              </div>
              <div id="search-games">
                <div
                  class="row text-center align-items-center my-1 mx-1"
                  v-if="true"
                >
                  <div
                    class="col-md-6 my-1 px-1"
                    v-for="game in searchGames"
                    :key="game.title"
                  >
                    <img
                      :src="game.source"
                      alt="test"
                      class="img-fluid"
                      :key="game.title"
                    />

                    <div class="carousel-caption">
                      <h5>{{ game.title }}</h5>
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
export default {
  name: "SearchResults",
  data() {
    return {
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
  overflow-y: auto;
  max-height: 600px;
}
#search-games {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;
  width: 100%;
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