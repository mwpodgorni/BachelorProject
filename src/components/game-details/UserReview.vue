<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2 col-sm-2 pr-0">
        <img
          class="avatar"
          src="https://images.theconversation.com/files/350865/original/file-20200803-24-50u91u.jpg?ixlib=rb-1.1.0&rect=37%2C29%2C4955%2C3293&q=45&auto=format&w=926&fit=clip"
        />
      </div>
      <div class="col pl-0">
        <div class="row">
          <div class="col">
            <p id="username" class="mb-0">{{ username }}</p>
            <rating :rating="rating"></rating>
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
  props: ["username", "rating", "date", "reviewText"],
  data() {
    return {};
  },
  created() {
    // console.log("date: " + this.date);
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
</style>
