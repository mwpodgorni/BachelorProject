<template>
  <span v-if="stars.length">
    <b-icon
      v-for="star in stars"
      :key="star.index"
      class="my-auto"
      style="width: 20px; height: 20px; color: yellow;"
      :icon="star.icon"
    ></b-icon>
    <!-- <svg
      v-for="n in fullStars"
      :key="n"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-star-fill mr-1"
      fill="yellow"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
      />
    </svg> -->
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
      // console.log(Math.floor(this.rating));
      // return Math.floor(this.rating);
      return starsArray;
    },
  },
  methods: {
    getFullStars() {
      var fullStars = new Array(Math.floor(this.rating));
      console.log(fullStars);
      return fullStars;
    },
  },
};
</script>

<style scoped>
p {
  color: white;
}
</style>
