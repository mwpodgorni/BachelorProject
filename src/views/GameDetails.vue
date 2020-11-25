<template>
  <div class="container-fluid" id="details-wrapper">
    <div class="row">
      <div class="col-sm-12 col-md-9">
        <div class="row mt-4">
          <div class="col-md-4 text-center" v-if="game">
            <b-img
              style="width: 100%; height: auto;"
              fluid
              :src="game.downloadURL"
            />
          </div>
          <div class="col-md-8" v-if="game">
            <div class="row">
              <div class="col-10">
                <h2>{{ game.title }}</h2>
              </div>
              <div class="col-2 d-flex flex-row-reverse" v-if="user.loggedIn">
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
              <rating class="ml-3 my-auto" :rating="rating"></rating
              ><span class="mr-1 ml-3 my-auto">
                <b-icon
                  class="my-auto"
                  style="width: 23px; height: 23px;"
                  icon="people-fill"
                ></b-icon>
                <span class="my-auto ml-1" style="font-size: 20px;">{{
                  reviews.length
                }}</span>
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
                  <b-icon
                    class="my-auto ml-2"
                    style="width: 20px; height: 20px;"
                    icon="controller"
                  ></b-icon>
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
                <div
                  class="description"
                  style="max-height: 150px; overflow-y: auto;"
                >
                  <span>{{ game.description }}</span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <hr />
              </div>
            </div>
            <div class="row" v-if="error">
              <div class="col">
                <b-alert
                  class="mb-1"
                  :show="dismissCountDownError"
                  variant="danger"
                  @dismissed="dismissCountDownError = 0"
                >
                  {{ error }}
                </b-alert>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <h3>Reviews</h3>
              </div>
              <div class="col d-flex flex-row-reverse">
                <b-button
                  v-if="this.user.loggedIn && !this.isReviewed()"
                  v-b-modal.write-review
                  variant="outline-light"
                >
                  <b-icon
                    class="my-auto ml-2"
                    style="width: 20px; height: 20px;"
                    icon="pen"
                  ></b-icon>
                </b-button>

                <b-modal
                  @ok="submitReview"
                  @hidden="resetForm"
                  id="write-review"
                  centered
                  title="Write Review"
                >
                  <b-form>
                    <b-form-textarea
                      id="textarea"
                      v-model="reviewText"
                      placeholder="Tell others what do you think about this game. Would you recommend it and why?"
                      rows="3"
                      max-rows="6"
                    ></b-form-textarea>
                    <b-form-rating v-model="reviewRating"></b-form-rating>
                    <div class="d-block text-center pt-3">
                      <p id="ratingFeedback">
                        {{ ratingFeedback }}
                      </p>
                    </div>
                  </b-form>

                  <template #modal-footer="{  cancel, ok }">
                    <b-button size="sm" variant="danger" @click="cancel()">
                      Cancel
                    </b-button>
                    <b-button
                      :disabled="reviewRating === 0"
                      variant="primary"
                      size="sm"
                      class="float-right"
                      v-on:click="ok()"
                    >
                      Submit
                    </b-button>
                  </template>
                </b-modal>
              </div>
            </div>
            <div
              class="py-5 mt-1"
              id="no-suggestions"
              style="border-radius: 4px;"
              v-if="reviewsLoadingState == 'notLoading'"
            >
              <h5 class="text-center" style="color: white;">No Reviews</h5>
            </div>
            <div
              class="text-center color3 py-5 mt-1"
              style="border-radius: 4px;"
              v-if="reviewsLoadingState == 'loading'"
            >
              <b-spinner
                class="my-2"
                label="Loading..."
                variant="light"
                type="grow"
              ></b-spinner>
              <h5 class="my-2" style="color: white;">Loading Reviews</h5>
            </div>
            <div class="row mt-3" v-if="reviewsLoadingState == 'loaded'">
              <div
                class="col-12"
                v-for="review in reviews"
                :key="review.reviewId"
              >
                <user-review
                  :username="review.displayName"
                  :rating="review.rating"
                  :date="review.datePosted.toDate().toLocaleDateString('en-US')"
                  :reviewText="review.content"
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
          <div
            class="row mt-1 px-2"
            v-for="game in similarGames"
            :key="game.gameId"
          >
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
import firebase from "firebase";
export default {
  components: {
    Rating,
    UserReview,
    SimilarGame,
  },
  data() {
    return {
      reviewsArray: [],
      selectReviewStars: [],
      reviewText: "",
      reviewRating: 0,
      error: "ha",
      dismissSecs: 5,
      dismissCountDownError: 0,
    };
  },

  computed: {
    ...mapGetters(["games", "user", "reviews", "reviewsLoadingState"]),
    game() {
      const gameId = this.$route.params.gameId;
      const game = this.games.find((game) => {
        return game.gameId === gameId;
      });
      return game;
    },
    rating() {
      var score = 0;
      this.reviews.forEach((review) => {
        score += review.rating;
      });
      return score / this.reviews.length;
    },
    ratingFeedback() {
      if (this.reviewRating === 1) {
        return "Hated it";
      } else if (this.reviewRating === 2) {
        return "Didn't like it";
      } else if (this.reviewRating === 3) {
        return "Just OK";
      } else if (this.reviewRating === 4) {
        return "Liked it";
      } else if (this.reviewRating === 5) {
        return "Loved it";
      }
      return "Rating required";
    },
    categories() {
      return this.game.categories;
    },
    similarGames() {
      if (this.games.length) {
        var similar = [];
        this.game.categories.forEach((thisCategory) => {
          this.games.forEach((game) => {
            if (
              game.categories.includes(thisCategory) &&
              this.game.gameId !== game.gameId &&
              !similar.includes(game)
            ) {
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
    // this.loadReviews();
    let gameId = this.$route.params.gameId;
    this.$store.dispatch("fetchReviews", gameId);
    console.log(
      `User logged in: ${
        this.user.loggedIn
      }; Game Reviewed: ${this.isReviewed()}`
    );
  },
  watch: {
    "$route.params.gameId"(value) {
      console.log("param check", value);
      this.$store.dispatch("fetchReviews", value);
    },
  },
  mounted() {
    let wrapperHeight = document.getElementById("details-wrapper").offsetHeight;
    document
      .getElementById("similar")
      .setAttribute("style", "height:" + wrapperHeight + "px");
  },
  methods: {
    getCurrentDate() {
      var d = new Date();
      return d;
    },
    loadReviews() {
      let gameId = this.$route.params.gameId;
      db.collection("reviews")
        .doc(gameId)
        .onSnapshot(function(doc) {
          console.log("re", doc.data());
          this.reviewsArray = doc.data();
        });
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
      console.log(
        `Adding ${this.game.gameId} to favorite games for ${this.user.data.displayName}`
      );
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
    resetForm() {
      (this.reviewText = ""), (this.reviewRating = 0);
    },
    submitReview(bvModalEvt) {
      if (this.reviewText && this.reviewRating != 0) {
        if (!this.isReviewed()) {
          let gameId = this.$route.params.gameId;
          let newReview = {
            datePosted: firebase.firestore.Timestamp.fromDate(new Date()),
            gameId: gameId,
            rating: this.reviewRating,
            content: this.reviewText,
            reviewId: `${gameId}_${this.user.userId}`,
            displayName: this.user.data.displayName,
            userId: this.user.userId,
          };
          let vm = this;
          db.collection("reviews")
            .doc(gameId)
            .update({
              reviews: firebase.firestore.FieldValue.arrayUnion(newReview),
            })
            .then(function(doc) {
              console.log(`Review Added`);
              vm.$store.dispatch("addReview", newReview);
            })
            .catch(function(error) {
              console.log("Error adding review:", error);
            });
        } else {
          this.error = "You already reviewed this game.";
          this.showErrorAlert();
        }
      } else {
        this.error = "Enter description and rating.";
        this.showErrorAlert();
      }
    },
    isReviewed() {
      this.reviews.length;
      for (let i = 0; i < this.reviews.length; i++) {
        if (this.user.userId == this.reviews[i].userId) {
          return true;
        }
      }
      return false;
    },
    showErrorAlert() {
      this.dismissCountDownError = this.dismissSecs;
    },
    // modalCreated() {
    //   for (let i = 0; i < 5; i++) {
    //     this.selectReviewStars.push({
    //       index: i,
    //       icon: "star",
    //     });
    //   }
    // },
    // highlightStars(index) {
    //   for (let i = 0; i <= index; i++) {
    //     this.selectReviewStars[i].icon = "star-fill";
    //   }
    //   if (index === 0) {
    //     this.ratingFeedback = "Hated it";
    //   } else if (index === 1) {
    //     this.ratingFeedback = "Didn't like it";
    //   } else if (index === 2) {
    //     this.ratingFeedback = "Just OK";
    //   } else if (index === 3) {
    //     this.ratingFeedback = "Liked it";
    //   } else if (index === 4) {
    //     this.ratingFeedback = "Loved it";
    //   }
    // },
    // resetHighlightStars() {
    //   for (let i = 0; i < 5; i++) {
    //     this.selectReviewStars[i].icon = "star";
    //   }
    //   this.ratingFeedback = "Rating required";
    // },
    // selectStars(index) {
    //   console.log(`Selected ${index + 1} stars!`);
    //   for (let i = 0; i <= index; i++) {
    //     this.selectReviewStars[i].icon = "star-fill";
    //   }
    //   this.addReviewRating = index + 1;
    // },
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
#ratingFeedback {
  color: black;
  font-weight: bold;
}
textarea {
  width: 100%;
  /* height: 100%; */
}
.card-body {
  padding: 0 !important;
}
</style>
