<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-9">
        <div class="row mt-5 px-5">
          <div class="col-md-3">
            <img :src="game.downloadURL" class="img-thumbnail img-fluid" />
          </div>
          <div class="col-md-9">
            <div class="row mt-1">
              <div class="col">
                <h2 v-if="game">{{ game.title }}</h2>
              </div>
              <div
                class="col d-flex flex-row-reverse pt-2"
                v-if="user.loggedIn"
              >
                <svg
                  v-if="!isFavorited"
                  @click="addFavorited()"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 16 16"
                  class="bi bi-heart"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
                  />
                </svg>
                <svg
                  v-if="isFavorited"
                  @click="removeFavorited()"
                  width="1.5rem"
                  height="1.5rem"
                  viewBox="0 0 16 16"
                  class="bi bi-heart-fill"
                  fill="red"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                  />
                </svg>
              </div>
            </div>
            <div class="row px-2 align-items-center">
              <rating v-if="score" :rating="score"></rating>
              <span class="align-baseline mt-0">
                <svg
                  width="1.2em"
                  height="1.2em"
                  viewBox="0 0 16 16"
                  class="bi bi-people-fill ml-4"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                  />
                </svg>
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
                <button class="btn btn-success" @click="playGame(game.title)">
                  Play
                  <svg
                    width="1.3em"
                    height="1.3em"
                    viewBox="0 0 16 16"
                    class="bi bi-play-fill"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr />
              </div>
            </div>
            <div class="row" v-if="game">
              <div class="col-12">
                <div class="description" v-if="game.description.length > 400">
                  <span v-if="!readMoreActivated">{{
                    game.description.slice(0, 400) + "..."
                  }}</span>
                  <div class="mt-2">
                    <a
                      style="color: gray"
                      v-if="!readMoreActivated"
                      href="#"
                      @click="activateReadMore"
                      >SHOW MORE</a
                    >
                  </div>
                </div>
                <div class="description" v-else>
                  <span>{{ game.description }}</span>
                  <div class="mt-2">
                    <a
                      style="color: gray"
                      v-if="readMoreActivated"
                      href="#"
                      @click="deactivateReadMore"
                      >SHOW LESS</a
                    >
                  </div>
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
            <div
              class="row mt-3"
              v-for="review of reviews"
              :key="review.reviewId"
            >
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
      <div class="col-md-3 mt-5">
        <div class="row">
          <h3>Similar</h3>
        </div>
        <div class="row mt-2" v-for="game in similarGames" :key="game.gameId">
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
      readMoreActivated: false,
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
      const filtered = this.$store.state.reviews.filter(
        (review) => review.gameId === gameId
      );
      return filtered;
    },
    score() {
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
      var similar = [];
      this.game.categories.forEach((thisCategory) => {
        this.games.forEach((game) => {
          game.categories.forEach((category) => {
            if (category === thisCategory && this.game.gameId !== game.gameId) {
              similar.push(game);
            }
          });
        });
      });

      // TODO
      // Sort the similar games based on score

      return similar.slice(0, 3);
    },
    isFavorited() {
      return this.user.data.favoritedGames.includes(this.game.gameId);
    },
  },
  created() {
    this.loadGames();
    this.loadReviews();
    console.log(this.user.data);
  },
  methods: {
    activateReadMore() {
      this.readMoreActivated = true;
    },
    deactivateReadMore() {
      this.readMoreActivated = false;
    },
    getCurrentDate() {
      var d = new Date();
      return d;
    },
    loadGames() {
      this.$store.dispatch("fetchGames");
    },
    loadReviews() {
      this.$store.dispatch("fetchReviews");
    },
    transformReviewDate(timestamp) {
      var t = new Date(1970, 0, 1);
      t.setSeconds(timestamp.seconds);
      return t.toLocaleDateString();
    },
    playGame(title) {
      this.$router.push(`../../../games/${title}`);
    },
    addFavorited() {
      console.log(
        `Adding ${this.game.gameId} to favorited games for ${this.user.data.displayName}`
      );
      this.$store.dispatch("addFavorited", {
        gameId: this.game.gameId,
        userId: this.user.data.userId,
      });
    },
    removeFavorited() {
      this.$store.dispatch("removeFavorited", {
        gameId: this.game.gameId,
        userId: this.user.data.userId,
      });
    },
  },
};
</script>

<style scoped>
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
</style>
