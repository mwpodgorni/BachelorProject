<template>
  <div class="container">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ userData.username }}</h1>
      </div>
      <div class="col-2 my-auto justify-content-end">
        <router-link to="edit-profile">
          <b-icon class="icon" icon="pencil-square"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="recentlyPlayed-row">
      <div class="col">
        <div class="row">
          <div class="col text-center">
            <h3 class="mx-auto my-2">Recently Played</h3>
          </div>
        </div>
        <div class="row">
          <div class="col px-0">
            <b-list-group id="recentlyPlayed-list">
              <b-list-group-item
                variant="dark"
                class="px-1"
                v-for="item in userData.recentlyPlayed"
                :key="item.title"
              >
                <div class="row mx-0" id="recentlyPlayed-item">
                  <div class="col-9">
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">{{ item.title }}</div>
                    </div>
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">Last played on {{ item.lastPlayed }}</div>
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
          <div class="col text-center px-0" style="height: 100%">
            <div style="height: 100vh">
              <ul class="hs full">
                <li class="item">test</li>
                <li class="item">test</li>
                <li class="item">test</li>
                <li class="item">test</li>
                <li class="item">test</li>
                <li class="item">test</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Dashboard</div>
          <div class="card-body">
            <div
              v-if="!user.loggedIn"
              class="alert alert-secondary"
              role="alert"
            >You are not logged in.</div>
            <div
              v-if="user.loggedIn"
              class="alert alert-success"
              role="alert"
            >You are logged in {{ }}!</div>
            <button
              v-if="user.loggedIn"
              type="button"
              class="btn btn-secondary"
              @click.prevent="signOut"
            >Sign Out</button>
            <router-link to="login" class="nav-link">
              <button v-if="!user.loggedIn" type="button" class="btn btn-success">Log In</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>-->
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
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          // this.$router.replace({
          //   name: "dashboard"
          // });
        });
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
  height: 100%;
}
#username-row,
#recentlyPlayed-item {
  background-color: #595858;
  color: white;
}
#recentlyPlayed-row,
#suggestions-row {
  background-color: #949292;
  color: white;
}
#recentlyPlayed-list {
  overflow: auto;
  height: 300px;
}

:root {
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
}
</style>
