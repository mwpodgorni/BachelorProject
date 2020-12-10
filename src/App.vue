<template>
  <div id="app" class="color1">
    <div id="navbar-wrapper">
      <b-navbar id="navbar" toggleable="sm" type="dark" class="py-0 color2" sticky>
        <b-navbar-brand>JugSquare</b-navbar-brand>
        <b-navbar-toggle class="ml-auto mr-2" target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item>
              <router-link to="../../games" class="nav-link py-0 my-0">Games</router-link>
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="row m-0 pr-2 py-2">
              <b-form-input v-model="keyword" size="sm" class="col-9" placeholder="Search"></b-form-input>
              <b-button v-model="keyword" @click.prevent="search" variant="outline-light" size="sm" class="col-3"
                >Search</b-button
              >
            </b-nav-form>
            <b-nav-item v-if="!user.loggedIn" class="my-auto">
              <router-link to="../login" class="nav-link p-0 m-0">Login</router-link>
            </b-nav-item>
            <b-nav-item v-if="!user.loggedIn" class="my-auto">
              <router-link to="../register" class="nav-link p-0 m-0">Register</router-link>
            </b-nav-item>
            <b-nav-item-dropdown right v-if="user.loggedIn">
              <template v-slot:button-content>
                <b-icon class="my-auto" id="icon" style="width: 27px; height: 27px;" icon="person-circle"></b-icon>
              </template>
              <b-dropdown-item to="../../profile">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click="openChat()">Messages</b-dropdown-item>
              <b-dropdown-item @click.prevent="signOut">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-nav>
          <b-nav-item v-if="['chat'].indexOf($route.name) > -1">
            <b-icon
              class="my-auto"
              v-b-toggle.sidebar-variant
              id="icon"
              style="width: 27px; height: 27px;"
              icon="people"
            ></b-icon>
          </b-nav-item>
          <b-nav-item v-if="isGameOpen">
            <b-icon
              class="my-auto"
              id="icon"
              style="width: 27px; height: 27px;"
              icon="arrow-left"
              v-on:click="goBack"
            ></b-icon></b-nav-item
        ></b-navbar-nav>
      </b-navbar>
      <!-- <b-alert
        :show="dismissCountDown"
        @dismissed="dismissCountDown = 0"
        dismissible
      >
        If you are playing on a phone and you can't see the full game window,
        try to zoom out.
      </b-alert> -->
    </div>
    <div id="content">
      <transition name="component-fade" mode="out-in">
        <router-view v-on:chooseGame="chooseGame($event)"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
<<<<<<< Updated upstream
import Games from "@/views/Games";
import { mapActions, mapGetters } from "vuex";
=======
import { mapGetters } from "vuex";
>>>>>>> Stashed changes
import firebase from "firebase";
export default {
  name: "App",
  components: {},
  data() {
    return {
      backgroud: [
        "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
        "linear-gradient(to right, #434343 0%, black 100%)",
        "linear-gradient(to bottom, #09203f 0%, #537895 100%)",
      ],
      keyword: "",
      keywordCheck: "",
      dismissSecs: 6,
      dismissCountDown: 0,
    };
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
    isGameOpen() {
      return this.$route.params.game;
    },
  },
  beforeCreate() {
    this.$store.dispatch("fetchGames");
  },
  mounted() {
    this.authAction();
  },
  methods: {
    ...mapActions(["authAction"]),
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("logout");
          this.openGames();
        });
    },
    openChat() {
      var userId = this.$route.params.userId;
      if (!userId) {
        this.$router.push("../../chat");
      }
    },
    chooseGame: function (game) {
      console.log("game app", game);
      this.$store.dispatch("addRecentlyPlayed", game);
      this.component = game.title.replace(/\s/g, "");
      this.showAlert();
      // document.body.style.background = "#007267";
    },
    openGames: function () {
      if (this.component != "Games") {
        document.body.style.background = "linear-gradient(to bottom, #09203f 0%, #537895 100%)";
        // Math.floor(Math.random() * 3)
      }
      this.component = "Games";
      this.$router.push("../../games");
      // this.$router.go(-1);
    },
    search() {
      if (this.keyword != this.$route.params.keyword && this.keyword) {
        console.log("search");
        this.keywordCheck = this.keyword;
        this.$router.push({
          name: "search",
          params: { keyword: this.keyword },
        });
      }
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  // mounted: function () {
  //   this.$nextTick(function () {
  //     // Code that will run only after the
  //     // entire view has been rendered
  //     // document.body.style.background = this.backgroud[2];
  //     document.body.style.background = this.backgroud[2];
  //     // Math.floor(Math.random() * 3)
  //   });
  // },
};
</script>

<style lang="scss">
/* SCROLLBAR */
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  background: #fcdab7;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #1e5f74;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #133b5c;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.color1 {
  background-color: #1d2d50;
}
.color2 {
  background-color: #133b5c;
}
.color3 {
  background-color: #1e5f74;
}
.color4 {
  background-color: #fcdab7;
}
.icon {
  color: white;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 999;
}
html,
body,
#app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  // background: linear-gradient(to bottom, #09203f 0%, #537895 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#app {
  display: table;
}
#content {
  display: table-row;
}
#navbar-wrapper {
  height: 40px;
  display: table-row;
}
</style>
