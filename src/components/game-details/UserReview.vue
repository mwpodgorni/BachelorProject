<template>
  <div class="container">
    <div class="row">
      <div class="col pl-0">
        <div class="row">
          <div class="col">
            <h4 id="username" class="mb-0" @click="goToProfile()">
              {{ username }}
            </h4>
            <rating id="rating" :rating="rating"></rating>
            <p id="date" class="mb-1">{{ date }}</p>
            <p id="reviewText">{{ reviewText }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Rating from "../game-details/Rating";
export default {
  components: {
    Rating,
  },
  props: ["userId", "username", "rating", "date", "reviewText"],
  data() {
    return {};
  },
  methods: {
    goToProfile() {
      this.$router.push(`../../user-profile/${this.userId}`);
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 4.75rem;
  height: 4.25rem;
  border-radius: 50%;
}
.row {
  color: white;
}
#username {
  font-weight: bold;
}
#date {
  font-style: italic;
  font-size: small;
}
#reviewText {
  font-size: small;
}
h4:hover {
  cursor: pointer;
}
</style>
