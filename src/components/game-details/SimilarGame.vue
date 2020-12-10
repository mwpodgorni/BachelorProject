<template>
  <div class="card mb-2">
    <img class="card-img-top" :src="imageUrl" :alt="title" />
    <div class="card-body p-1" style="background-color: #133b5c;">
      <div v-if="inGameDetails">
        <h5 class="card-title text-center" v-if="inGameDetails">{{ title }}</h5>
        <p class="card-text">
          {{ description }}
        </p>
      </div>
      <div class="card-title d-flex justify-content-between" v-if="inProfile">
        <h5>{{ title }}</h5>
        <b-icon
          @click="removeFavoriteClicked()"
          class="my-auto"
          style="width: 20px; height: 20px; color: #ffffff; cursor: pointer;"
          icon="trash"
        ></b-icon>
      </div>
      <div v-if="inUserProfile">
        <h5>{{ title }}</h5>
      </div>

      <button
        @click.stop="playGame(title)"
        type="button"
        class="btn btn-block btn-outline-light mt-3"
      >
        Play
      </button>
      <button
        @click="viewGameDetails(gameId)"
        type="button"
        class="btn btn-block btn-outline-light mt-1"
      >
        Details
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "imageUrl",
    "title",
    "description",
    "gameId",
    "inGameDetails",
    "inProfile",
    "inUserProfile",
  ],
  methods: {
    viewGameDetails(gameId) {
      this.$router.push(`${gameId}`);
    },
    playGame(game) {
      this.$store.dispatch("addRecentlyPlayed", {
        title: this.title,
        gameId: this.gameId,
      });
      this.$router.push(`../../games/${game}`);
    },
    removeFavoriteClicked() {
      this.$emit("removeClicked");
    },
  },
};
</script>

<style scoped>
h5,
p {
  color: white;
}
p {
  font-size: 14px;
}
/* .card:hover {
  cursor: pointer;
} */
</style>
