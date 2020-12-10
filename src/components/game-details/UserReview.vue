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
import { mapGetters } from "vuex";
import Rating from "../game-details/Rating";
export default {
  components: {
    Rating,
  },
  props: ["userId", "username", "rating", "date", "reviewText"],
<<<<<<< Updated upstream
=======
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
>>>>>>> Stashed changes
  methods: {
    goToProfile() {
      if (this.user.userId != this.userId) {
        this.$router.push(`../../user-profile/${this.userId}`);
      } else {
        this.$router.push(`../../profile`);
      }
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
