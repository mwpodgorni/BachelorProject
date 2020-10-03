<template>
  <div class="container" id="profile">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ user.data.displayName }}</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <router-link to="edit-profile">
          <b-icon class="icon mr-1" icon="pencil-square"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="recentlyPlayed-row">
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <h3 class="mx-auto my-2" @click.prevent="check">Recently Played</h3>
          </div>
        </div>
        <div class="row">
          <div class="col px-0">
            <div
              class="text-center w-100 h-100 py-5"
              id="no-activity"
              v-if="!user.data.recentlyPlayed.length"
            >
              <h4>No recent activity</h4>
            </div>
            <b-list-group
              id="recentlyPlayed-list"
              v-if="user.data.recentlyPlayed.length"
            >
              <b-list-group-item
                variant="dark"
                class="px-1"
                v-for="item in user.data.recentlyPlayed"
                :key="item.title"
              >
                <div class="row mx-0" id="recentlyPlayed-item">
                  <div class="col-9">
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">{{ item.title }}</div>
                    </div>
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                        Last played on:
                        {{
                          item.lastPlayed.toDate().toLocaleDateString("en-US")
                        }}
                      </div>
                    </div>
                  </div>
                  <div class="col-3 my-auto">
                    <p class="h5">
                      <b-icon class="float-right" icon="arrow-up"></b-icon>
                    </p>
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </div>
    </div>
    <div class="row" id="suggestions-row">
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <h3 class="mx-auto my-2">Suggestions</h3>
          </div>
        </div>
        <div class="row">
          <div class="col text-center py-4 px-0" style="height: 100%">
            <div>
              <div
                id="carouselExampleIndicators"
                class="carousel slide"
                data-ride="carousel"
              >
                <ol class="carousel-indicators">
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="0"
                    class="active"
                  ></li>
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="1"
                  ></li>
                  <li
                    data-target="#carouselExampleIndicators"
                    data-slide-to="2"
                  ></li>
                </ol>
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img
                      style="height: 200px"
                      class="d-block mx-auto img-fluid"
                      src="./../assets/jsq.png"
                      alt="First slide"
                    />
                    <div class="carousel-caption d-md-block">
                      <h5>Game Title</h5>
                      <p>Very descriptive game description</p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img
                      style="height: 200px"
                      class="d-block mx-auto img-fluid"
                      src="./../assets/jsq.png"
                      alt="Second slide"
                    />
                    <div class="carousel-caption d-md-block">
                      <h5>Game Title</h5>
                      <p>Very descriptive game description</p>
                    </div>
                  </div>
                  <div class="carousel-item">
                    <img
                      style="height: 200px"
                      class="d-block mx-auto img-fluid"
                      src="./../assets/jsq.png"
                      alt="Third slide"
                    />
                    <div class="carousel-caption d-md-block">
                      <h5>Game Title</h5>
                      <p>Very descriptive game description</p>
                    </div>
                  </div>
                </div>
                <a
                  class="carousel-control-prev"
                  href="#carouselExampleIndicators"
                  role="button"
                  data-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a
                  class="carousel-control-next"
                  href="#carouselExampleIndicators"
                  role="button"
                  data-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import userData from "@/assets/json-data/user-data.json";
export default {
  components: {},
  data() {
    return {
      userData: userData,
    };
  },
  methods: {
    check() {
      console.log(this.user.data);
    },
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
  },
};
</script>
<style>
.container {
  display: flex;
  flex-flow: column;
  height: 100%;
  /* overflow-y: hidden; */
}
#profile * {
  color: white;
}
#username-row,
#recentlyPlayed-item {
  background-color: #636a70;
}
#recentlyPlayed-row,
#suggestions-row {
  background-color: #32383e;
}
#no-activity {
  background-color: #636a70;
}
#recentlyPlayed-list {
  overflow: auto;
  height: 265px;
  /* height: 50%; */
}
#suggestions-row {
}

/* :root {
  --gutter: 20px;
}

.hs {
  display: grid;
  grid-gap: calc(var(--gutter) / 2);
  grid-template-columns: 10px;
  grid-template-rows: minmax(150px, 1fr);
  grid-auto-flow: column;
  grid-auto-columns: calc(50% - var(--gutter) * 2);

  overflow-x: scroll;
  scroll-snap-type: x proximity;
  padding-bottom: calc(0.75 * var(--gutter));
  margin-bottom: calc(-0.25 * var(--gutter));
}

.hs:before,
.hs:after {
  content: "";
  width: 10px;
}

ul {
  list-style: none;
  padding: 0;
}

.hs > li,
.item {
  scroll-snap-align: center;
  padding: calc(var(--gutter) / 2 * 1.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  height: 190px;
} */
</style>
