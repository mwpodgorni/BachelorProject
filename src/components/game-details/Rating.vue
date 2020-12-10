<template>
  <span v-if="stars.length">
    <b-icon
      v-for="star in stars"
      :key="star.index"
      class="my-auto"
      style="width: 20px; height: 20px; color: yellow;"
      :icon="star.icon"
    ></b-icon>
  </span>
</template>
<script>
export default {
  props: ["rating"],

  computed: {
    stars() {
      let starsArray = [];
      let index = 0;
      for (let i = 0; i < Math.floor(this.rating); i++) {
        starsArray.push({ icon: "star-fill", index: index });
        index++;
      }
      if (this.rating % 1 >= 0.5 && starsArray.length < 6) {
        starsArray.push({ icon: "star-half", index: index });
        index++;
      }
      while (starsArray.length < 5) {
        starsArray.push({ icon: "star", index: index });
        index++;
      }
      return starsArray;
    },
  },
};
</script>

<style scoped>
p {
  color: white;
}
</style>
