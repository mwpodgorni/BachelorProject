<template>
  <div id="app">
    <b-navbar
      id="navbar"
      toggleable="md"
      type="dark"
      variant="dark"
      class="py-0"
      sticky
    >
      <b-navbar-brand>JugSquare</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link to="../games" class="nav-link py-0 my-0"
              >Games</router-link
            >
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              v-model="keyword"
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
            ></b-form-input>
            <b-button
              v-model="keyword"
              @click.prevent="search"
              variant="outline-light"
              size="sm"
              class="my-2 my-sm-0"
              >Search</b-button
            >
          </b-nav-form>

          <b-nav-item v-if="!user.loggedIn">
            <router-link to="../login" class="nav-link p-0 ml-2 m-0"
              >Login</router-link
            >
          </b-nav-item>
          <b-nav-item v-if="!user.loggedIn">
            <router-link to="../register" class="nav-link p-0 m-0"
              >Register</router-link
            >
          </b-nav-item>
          <b-nav-item-dropdown right v-if="user.loggedIn">
            <template v-slot:button-content>
              <!-- <b-icon
                class="ml-2"
                id="icon"
                icon="person-square"
                style="width: 27px; height: 27px"
              ></b-icon> -->
              <b-icon
                class="ml-2"
                id="icon"
                style="width: 27px; height: 27px;"
                icon="person-circle"
              ></b-icon>
            </template>
            <b-dropdown-item to="../profile">Profile</b-dropdown-item>
            <b-dropdown-item to="../chat">Messages</b-dropdown-item>
            <b-dropdown-item @click.prevent="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item v-if="['chat'].indexOf($route.name) > -1">
            <b-icon
              v-b-toggle.sidebar-variant
              id="icon"
              style="width: 27px; height: 27px;"
              icon="people"
            ></b-icon>
          </b-nav-item>
          <b-nav-item v-if="component != 'Games'">
            <b-icon
              id="icon"
              style="width: 27px; height: 27px;"
              icon="arrow-left"
              v-on:click="openGames"
            ></b-icon
          ></b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

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
import SquarePlatformer from "@/components/games/1-square_platformer/SquarePlatformer";
import SameSquare from "@/components/games/2-same_square/SameSquare";
import SquareTower from "@/components/games/3-square_tower/SquareTower";
import PerfectSquare from "@/components/games/4-perfect_square/PerfectSquare";
import FlyingSquare from "@/components/games/5-flying_square/FlyingSquare";
import SquareRide from "@/components/games/6-square_ride/SquareRide";
import SpinningSquares from "@/components/games/7-spinning_squares/SpinningSquares";
import BouncingSquare from "@/components/games/8-bouncing_square/BouncingSquare";
import SquareShip from "@/components/games/9-square_ship/SquareShip";
import SquareSlingshot from "@/components/games/10-square_slingshot/SquareSlingshot";
import DrawRoad from "@/components/games/11-draw_road/DrawRoad";
import SquareSnake from "@/components/games/12-square_snake/SquareSnake";
import Games from "@/views/Games";
// import { store, mutations } from "@/store.js";
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  name: "App",
  components: {
    SquarePlatformer,
    SameSquare,
    SquareTower,
    PerfectSquare,
    FlyingSquare,
    SquareRide,
    SpinningSquares,
    BouncingSquare,
    SquareShip,
    SquareSlingshot,
    DrawRoad,
    SquareSnake,
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
    chooseGame: function (game) {
      console.log("game app", game);
      this.component = game;
      document.body.style.background = "#007267";
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
body {
  // overflow: hidden;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background: linear-gradient(to bottom, #09203f 0%, #537895 100%);
  height: 100%;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#app {
  // height: 100vh;
  // width: 100vw;
  display: flex;
  flex-flow: column;
  height: 100%;
}

#content {
  // height: 96%;
  // overflow-y: auto;
  flex-grow: 1 1 auto;
  width: 100%;
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

// #app {
//   width: 100%;
//   height: 100%;
// }
// #content {
//   height: 100%;
//   overflow-y: auto;
// }
// html {
//   height: 100%;
// }
// body {
//   overflow: hidden;
//   border: 0;
//   margin: 0;
//   padding: 0;
//   font-family: "Lato";
//   height: 100%;
//   justify-content: center;
//   align-items: center;
//   margin: 0;
//   background: linear-gradient(to top, #30cfd0 0%, #330867 100%);
// background: linear-gradient(
//   45deg,
//   rgb(75, 96, 107) 0%,
//   rgba(96, 125, 139, 1) 48%,
//   rgb(155, 189, 206) 100%
// );
// }
</style>
