<template>
  <div class="container-fluid">
    <div class="row mt-5 px-5">
      <div class="col-md-2">
        <img
          src="https://images-na.ssl-images-amazon.com/images/I/61mVIP6Oo1L.png"
        />
      </div>
      <div class="col-md-7">
        <div class="row">
          <div class="col">
            <h2>Perfect Square</h2>
          </div>
          <div class="col d-flex flex-row-reverse">
            <svg
              width="2rem"
              height="2rem"
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
          </div>
        </div>
        <div class="row d-flex">
          <div class="col-2 justify-content-start">
            <rating rating="4"></rating>
          </div>
          <div class="col">
            <p>
              <svg
                width="1.2em"
                height="1.2em"
                viewBox="0 0 16 16"
                class="bi bi-people-fill"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
                />
              </svg>
              <!-- <div> -->
              22,643
            </p>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span class="badge badge-pill badge-info p-2 mr-1">Platformer</span>
            <span class="badge badge-pill badge-info p-2">Puzzle</span>
          </div>
          <div class="col d-flex flex-row-reverse">
            <button class="btn btn-success">
              Play
              <svg
                width="1em"
                height="1em"
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
        <div class="row">
          <div class="col-12">
            <div id="description">
              <span v-if="!readMoreActivated">{{
                description.slice(0, 400) + "..."
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
              <span v-if="readMoreActivated">{{ description }}</span>
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
        <div class="row mt-3">
          <div class="col-12">
            <user-review
              username="CatLover68"
              :rating="4"
              :date="currentDate"
              :reviewText="reviewText"
            ></user-review>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Rating from "../components/game-details/Rating";
import UserReview from "../components/game-details/UserReview";
export default {
  components: {
    Rating,
    UserReview,
  },
  data() {
    return {
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              suscipit, felis sed ornare elementum, quam tellus maximus purus,
              nec pharetra lacus justo sit amet eros. Nullam fringilla felis in
              purus pulvinar blandit. Praesent vitae pellentesque lectus.
              Curabitur dignissim vel ligula ut venenatis. Donec ut libero
              volutpat, ornare turpis id, laoreet elit. Quisque in pellentesque
              risus. Duis sagittis sem id ipsum tincidunt posuere. Praesent
              ipsum est, tempus sit amet metus sit amet, mattis porttitor
              sapien. Duis maximus erat luctus mauris vestibulum rhoncus. Donec
              eget hendrerit tellus. Nullam facilisis orci non tortor sodales,
              vitae sollicitudin nulla venenatis. Mauris eget volutpat tellus.
              Donec enim urna, tincidunt vitae ipsum nec, ultrices bibendum
              sapien.`,
      readMoreActivated: false,
      reviewText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Curabitur at diam interdum lorem bibendum semper. 
                  Etiam eu tempus libero, quis commodo lorem. Morbi a arcu 
                  faucibus, feugiat erat in, fermentum nibh. Vivamus congue 
                  libero at quam bibendum aliquet. Nullam eget vestibulum 
                  purus, sit amet vestibulum lectus. Suspendisse venenatis 
                  tincidunt turpis. Aenean facilisis enim non posuere molestie. 
                  Ut purus enim, dapibus ac augue vitae, pulvinar sagittis tellus.`,
      currentDate: new Date(),
    };
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
      console.log("date: " + d);
      return d;
    },
  },
};
</script>

<style scoped>
img {
  height: 10rem;
  width: auto;
}
h3 {
  color: gray;
}
hr {
  border-color: white;
}
#description,
h2,
p {
  color: white;
}
</style>
