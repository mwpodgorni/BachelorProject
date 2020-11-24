<template>
  <div class="container-fluid" id="details-wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-9">
        <div class="row mt-4">
          <div class="col-md-4 text-center" v-if="game">
            <b-img style="width: 100%; height: auto;" fluid :src="game.downloadURL" />
          </div>
          <div class="col-md-8" v-if="game">
            <div class="row">
              <div class="col">
                <h2>{{ game.title }}</h2>
              </div>
              <div class="col d-flex flex-row-reverse" v-if="user.loggedIn">
                <b-icon
                  v-if="!isFavorite"
                  @click="addFavorite()"
                  class="my-auto"
                  style="width: 30px; height: 30px; color: #ffffff; cursor: pointer;"
                  icon="heart"
                ></b-icon>
                <b-icon
                  v-if="isFavorite"
                  @click="removeFavorite()"
                  class="my-auto"
                  style="width: 30px; height: 30px; color: #ff0000; cursor: pointer;"
                  icon="heart-fill"
                ></b-icon>
              </div>
            </div>
            <div class="row">
              <rating class="ml-3" :rating="rating"></rating
              ><span class="mr-1 ml-3 my-auto">
                <b-icon class="my-auto" style="width: 23px; height: 23px;" icon="people-fill"></b-icon>
                {{ nrOfReviews }}
              </span>
            </div>
            <div class="row">
              <div class="col">
                <span
                  class="badge badge-pill badge-info p-2 mr-1 mt-3"
                  v-for="category in categories"
                  :key="category"
                  >{{ category }}</span
                >
              </div>
              <div class="col d-flex flex-row-reverse pt-2">
                <b-button variant="outline-light" @click="playGame(game)">
                  Play
                  <b-icon class="my-auto ml-2" style="width: 20px; height: 20px;" icon="controller"></b-icon>
                </b-button>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr />
              </div>
            </div>
            <div class="row" v-if="game">
              <div class="col-12">
                <div class="description" style="max-height: 150px; overflow-y: auto;">
                  <span>{{ game.description }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <h3>Reviews</h3>
              </div>
            </div>
            <div class="row mt-3" v-for="review of reviews" :key="review.reviewId">
              <div class="col-12">
                <user-review
                  :username="review.user"
                  :rating="review.rating"
                  :date="transformReviewDate(review.datePosted)"
                  :reviewText="review.reviewBody"
                ></user-review>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-3 pt-4 text-center" id="similar">
        <!-- DONT REMOVE - second variant of the 'similar games' -->
        <!-- <b-card text-variant="white" class="pt-2" title="Similar Games">
          <b-card-body style="height: 550px; overflow: auto;">
            <div class="row mx-0 mt-1 px-2" v-for="game in similarGames" :key="game.gameId">
              <similar-game
                :imageUrl="game.downloadURL"
                :title="game.title"
                :description="game.description"
                :gameId="game.gameId"
              ></similar-game>
            </div>
          </b-card-body>
        </b-card> -->

        <div class="row">
          <h3 class="mx-auto">Similar Games</h3>
        </div>
        <div v-if="similarGames">
          <div class="row mt-1 px-2" v-for="game in similarGames" :key="game.gameId">
            <similar-game
              :imageUrl="game.downloadURL"
              :title="game.title"
              :description="game.description"
              :gameId="game.gameId"
            ></similar-game>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Rating from "../components/game-details/Rating";
import UserReview from "../components/game-details/UserReview";
import SimilarGame from "../components/game-details/SimilarGame";
export default {
  components: {
    Rating,
    UserReview,
    SimilarGame,
  },
  data() {
    return {
      nrOfReviews: 0,
    };
  },
  computed: {
    ...mapGetters(["games", "user"]),
    game() {
      const gameId = this.$route.params.gameId;
      const game = this.games.find((game) => {
        return game.gameId === gameId;
      });
      return game;
    },
    reviews() {
      const gameId = this.$route.params.gameId;
      const filtered = this.$store.state.reviews.filter((review) => review.gameId === gameId);
      return filtered;
    },
    rating() {
      var score = 0;
      this.reviews.forEach((review) => {
        if (review.gameId === this.game.gameId) {
          score += review.rating;
          this.nrOfReviews++;
        }
      });
      return score / this.nrOfReviews;
    },
    categories() {
      return this.game.categories;
    },
    similarGames() {
      if (this.games.length) {
        var similar = [];
        this.game.categories.forEach((thisCategory) => {
          this.games.forEach((game) => {
            if (game.categories.includes(thisCategory) && this.game.gameId !== game.gameId && !similar.includes(game)) {
              similar.push(game);
            }
          });
        });
        // TODO
        // Sort the similar games based on score
        return similar;
      }
    },
    isFavorite() {
      let arr = [];
      this.user.data.favoriteGames.forEach((e) => {
        arr.push(e.gameId);
      });
      return arr.includes(this.game.gameId);
    },
  },
  created() {
    // this.loadGames();
    this.loadReviews();
  },
  mounted() {
    let wrapperHeight = document.getElementById("details-wrapper").offsetHeight;
    document.getElementById("similar").setAttribute("style", "height:" + wrapperHeight + "px");
  },
  methods: {
    getCurrentDate() {
      var d = new Date();
      return d;
    },
    // loadGames() {
    //   this.$store.dispatch("fetchGames");
    // },
    loadReviews() {
      this.$store.dispatch("fetchReviews");
    },
    transformReviewDate(timestamp) {
      var t = new Date(1970, 0, 1);
      t.setSeconds(timestamp.seconds);
      return t.toLocaleDateString();
    },
    playGame(game) {
      this.$store.dispatch("addRecentlyPlayed", game);
      this.$router.push(`../../../games/${game.title}`);
    },
    addFavorite() {
      console.log(`Adding ${this.game.gameId} to favorite games for ${this.user.data.displayName}`);
      this.$store.dispatch("addFavorite", {
        gameId: this.game.gameId,
        title: this.game.title,
        userId: this.user.data.userId,
      });
    },
    removeFavorite() {
      this.$store.dispatch("removeFavorite", {
        gameId: this.game.gameId,
        title: this.game.title,
        userId: this.user.data.userId,
      });
    },
  },
};
</script>

<style scoped>
#details-wrapper {
  display: flex;
  flex-flow: column;
  height: 100%;
}
#details-wrapper h3 {
  color: white;
}

img {
  height: 13rem;
  width: auto;
}
h3 {
  color: gray;
}
hr {
  border-color: white;
}
.description,
h2,
p,
span {
  color: white;
}
#similar {
  /* max-height: 600px; */
  /* height: inherit; */
  overflow-y: auto;
}
.card-body {
  padding: 0 !important;
}
</style>
