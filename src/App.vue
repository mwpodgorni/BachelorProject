<template>
  <div id="app">
    <div id="navbar-wrapper">
      <b-navbar
        id="navbar"
        toggleable="sm"
        type="dark"
        variant="dark"
        class="py-0"
        sticky
      >
        <b-navbar-brand>JugSquare</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav class="align-items-center">
          <b-navbar-nav>
            <b-nav-item>
              <router-link to="../games" class="nav-link py-0 my-0"
                >Games</router-link
              >
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-form class="row m-0 pr-2 py-2">
              <b-form-input
                v-model="keyword"
                size="sm"
                class="col-9"
                placeholder="Search"
              ></b-form-input>
              <b-button
                v-model="keyword"
                @click.prevent="search"
                variant="outline-light"
                size="sm"
                class="col-3"
                >Search</b-button
              >
            </b-nav-form>

            <b-nav-item v-if="!user.loggedIn" class="my-auto">
              <router-link to="../login" class="nav-link p-0 m-0"
                >Login</router-link
              >
            </b-nav-item>
            <b-nav-item v-if="!user.loggedIn" class="my-auto">
              <router-link to="../register" class="nav-link p-0 m-0"
                >Register</router-link
              >
            </b-nav-item>
            <b-nav-item-dropdown right v-if="user.loggedIn">
              <template v-slot:button-content>
                <b-icon
                  class="my-auto"
                  id="icon"
                  style="width: 27px; height: 27px;"
                  icon="person-circle"
                ></b-icon>
              </template>
              <b-dropdown-item to="../profile">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click="openChat()"
                >Messages</b-dropdown-item
              >
              <b-dropdown-item @click.prevent="signOut"
                >Sign Out</b-dropdown-item
              >
            </b-nav-item-dropdown>
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
                v-on:click="openGames"
              ></b-icon
            ></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <div id="content">
      <transition name="component-fade" mode="out-in">
        <router-view v-on:chooseGame="chooseGame($event)"></router-view>
        <!-- <router-view v-on:chooseGame="chooseGame($event)"></router-view> -->
        <!-- <component
        v-bind:is="component"
        v-on:chooseGame="chooseGame($event)"
        style="margin-top:-33px;"
        ></component>-->
      </transition>
    </div>
  </div>
</template>

<script>
import Games from "@/views/Games";
// import { store, mutations } from "@/store.js";
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  name: "App",
  components: {
    Games,
  },
  data() {
    return {
      component: "Games",
      backgroud: [
        "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
        "linear-gradient(to right, #434343 0%, black 100%)",
        "linear-gradient(to bottom, #09203f 0%, #537895 100%)",
      ],
      changeIconColor: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      keyword: "",
      keywordCheck: "",
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
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.dismissCountDown = this.dismissSecs;
          this.$store.dispatch("logout");
          this.openGames();
          // this.$router.replace({
          //   name: "dashboard",
          // });
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
      if (this.user.loggedIn) {
        this.user.data.recentlyPlayed.forEach((element) => {
          if (element.title == game.title) {
            db.collection("users")
              .doc(this.user.userId)
              .update({
                recentlyPlayed: firebase.firestore.FieldValue.arrayRemove({
                  gameId: element.gameId,
                  lastPlayed: element.lastPlayed,
                  title: element.title,
                }),
              })
              .then(function (doc) {
                console.log("added to recently Played");
              })
              .catch(function (error) {
                console.log("Error getting document:", error);
              });
          }
        });
        db.collection("users")
          .doc(this.user.userId)
          .update({
            recentlyPlayed: firebase.firestore.FieldValue.arrayUnion({
              gameId: "",
              lastPlayed: new Date(),
              title: game.title,
            }),
          })
          .then(function (doc) {
            console.log("added to recently Played");
          })
          .catch(function (error) {
            console.log("Error getting document:", error);
          });
      }

      this.component = game.title.replace(/\s/g, "");
      // document.body.style.background = "#007267";
    },
    openGames: function () {
      if (this.component != "Games") {
        document.body.style.background =
          "linear-gradient(to bottom, #09203f 0%, #537895 100%)";
        // Math.floor(Math.random() * 3)
      }
      this.component = "Games";
      // this.$router.push("../games");
      this.$router.go(-1);
    },
    search() {
      if (this.keyword != this.$route.params.keyword) {
        console.log("search");
        this.keywordCheck = this.keyword;
        this.$router.push({
          name: "search",
          params: { keyword: this.keyword },
        });
      }
      // this.$router.push("search/" + this.keyword);
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
  background: #f1f1f1;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
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
  background: linear-gradient(to bottom, #09203f 0%, #537895 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#app {
  // height: 100vh;
  // width: 100vw;
  // display: flex;
  // flex-flow: column;
  // height: 100%;
  display: table;
}

#content {
  // height: 96%;
  // overflow-y: auto;
  display: table-row;
}
.account-link,
.account-link:hover {
  text-decoration: none;
  color: #272a2b !important;
  // background-color: #272a2b !important;
}
#navbar {
  background-color: #32383e !important;
}
#navbar-wrapper {
  height: 40px;
  display: table-row;
}
</style>
