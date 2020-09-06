<template>
  <div class="container">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{ userData.username }}</h1>
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
                <div
                  class="row mx-0"
                  id="recentlyPlayed-item"
                  style="width=10%;"
                >
                  <div class="col-9">
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">{{ item.title }}</div>
                    </div>
                    <div class="row m-0 p-0">
                      <div class="col m-0 p-0">
                        Last played on {{ item.lastPlayed }}
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
          <div class="col text-center px-0" style="height: 100%">
            <div></div>
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
    // signOut() {
    //   firebase
    //     .auth()
    //     .signOut()
    //     .then(() => {
    //       // this.$router.replace({
    //       //   name: "dashboard"
    //       // });
    //     });
    // },
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
/* .container-fluid {
  width: 100%;
} */
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
  height: 200px;
  overflow: auto;
}
</style>
