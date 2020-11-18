<template>
  <div class="card" style="width: 65%;" @click="viewGameDetails(gameId)">
    <img class="card-img-top" :src="imageUrl" :alt="title" />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">
        {{ description }}
      </p>
      <a @click="playGame(title)" class="btn btn-primary">Play</a>
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
    playGame(title) {
      this.$router.push(`../${title}`);
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
