<template>
  <div class="card mb-2">
    <img class="card-img-top" :src="imageUrl" :alt="title" />
    <div class="card-body p-1" style="background-color: #133b5c;">
      <h5 class="card-title mb-1">{{ title }}</h5>
      <!-- <p class="card-text">
        {{ description }}
      </p> -->
      <!-- <a class="btn btn-primary">Play</a> -->
      <button @click.stop="playGame(title)" type="button" class="btn btn-block btn-outline-light">Play</button>
      <button @click="viewGameDetails(gameId)" type="button" class="btn btn-block btn-outline-light">Details</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["imageUrl", "title", "description", "gameId"],
  methods: {
    viewGameDetails(gameId) {
      this.$router.push(`${gameId}`);
    },
    playGame(game) {
      console.log(game);
      this.$router.push(`../../games/${game}`);
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
.card:hover {
  cursor: pointer;
}
</style>
