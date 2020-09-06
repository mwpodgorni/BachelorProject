<template>
  <div id="app">
    <nav class="main-nav">
      <div class="logo">
        <!-- <img src="./assets/jsq-background-logo.png" class="mx-auto" height="30px" width="30px" /> -->
        <!-- <img
          src="https://www.webfreecounter.com/hit.php?id=gekdkfo&nd=4&style=20"
          border="0"
          alt="visitor counter"
        />-->
      </div>
      <Burger></Burger>
      <b-icon
        @click.prevent="signOut"
        :style="isBurgerActive ? { color: 'black' } : { color: 'white' }"
        v-if="user.loggedIn"
        id="icon"
        icon="box-arrow-left"
        v-on:click="openGames"
      ></b-icon>
      <b-icon
        :style="changeIconColor ? { color: 'black' } : { color: 'white' }"
        id="icon"
        v-if="component != 'Games' && isPanelOpen"
        icon="arrow-left"
        v-on:click="openGames"
      ></b-icon>
    </nav>
    <b-alert
      :show="dismissCountDown"
      dismissible
      @dismissed="dismissCountDown=0"
      class="m-0"
    >You are logged out</b-alert>
    <Sidebar>
      <div id="nav-buttons"></div>
      <ul class="sidebar-panel-nav">
        <li>
          <img class="my-2" src="./assets/jsq2.png" height="50px" width="50px" />
        </li>
        <li>
          <router-link to="games" class="nav-link sidenav-link">Games</router-link>
        </li>
        <li>
          <router-link v-if="!user.loggedIn" to="login" class="nav-link sidenav-link">Login</router-link>
        </li>
        <li>
          <router-link v-if="!user.loggedIn" to="register" class="nav-link sidenav-link">Register</router-link>
        </li>
        <li>
          <router-link to="profile" class="nav-link sidenav-link">Profile</router-link>
        </li>
        <!-- <li v-on:click="openGames">Games</li> -->
      </ul>
    </Sidebar>
    <transition name="component-fade" mode="out-in">
      <router-view v-on:chooseGame="chooseGame($event)"></router-view>
      <!-- <component
        v-bind:is="component"
        v-on:chooseGame="chooseGame($event)"
        style="margin-top:-33px;"
      ></component>-->
    </transition>
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
import Burger from "./components/Menu/Burger.vue";
import Sidebar from "./components/Menu/Sidebar.vue";
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
    Burger,
    Sidebar,
    Games,
  },
  data() {
    return {
      component: "Games",
      backgroud: [
        "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
        "linear-gradient(to right, #434343 0%, black 100%)",
        "linear-gradient(to top, #09203f 0%, #537895 100%)",
      ],
      changeIconColor: false,
      dismissSecs: 5,
      dismissCountDown: 0,
    };
  },
  computed: {
    ...mapGetters({
      isBurgerActive: "isNavOpen",
    }),
    ...mapGetters({
      isNavOpen: "isNavOpen",
    }), // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      user: "user",
    }),
    isPanelOpen() {
      if (this.isNavOpen) {
        this.changeIconColor = true;
        // document.getElementById("icon").color = "black";
      } else {
        this.changeIconColor = false;
        // document.getElementById("icon").color = "white";
      }
      return true;
    },
  },
  methods: {
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.dismissCountDown = this.dismissSecs;
          // this.$router.replace({
          //   name: "dashboard"
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
        document.body.style.background = this.backgroud[0];
        // Math.floor(Math.random() * 3)
      }
      this.component = "Games";
      this.$router.push("../games");
    },
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered

      document.body.style.background = this.backgroud[0];
      // Math.floor(Math.random() * 3)
    });
  },
};
</script>

<style lang="scss">
#icon {
  color: white;
  width: 32px;
  height: 32px;
  cursor: pointer;
  z-index: 999;
  margin-top: -2px;
  margin-left: -4px;
}
#nav-buttons {
  width: 100%;
  height: 30px;
  background-color: #fff;
}
.sidenav-link {
  color: black;
}
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

#app {
  width: 100%;
  height: 100%;
}
html {
  height: 100%;
  overflow: hidden;
}
body {
  overflow-y: hidden;
  overflow-x: hidden;
  border: 0;
  margin: 0;
  padding: 0;
  font-family: "Lato";
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 0;
  background: linear-gradient(to top, #30cfd0 0%, #330867 100%);
  // background: linear-gradient(
  //   45deg,
  //   rgb(75, 96, 107) 0%,
  //   rgba(96, 125, 139, 1) 48%,
  //   rgb(155, 189, 206) 100%
  // );
}
.logo {
  z-index: 999;
  align-self: center;
  color: #fff;
  font-weight: bold;
  font-family: "Lato";
}

.main-nav {
  display: flex;
  align-items: right;
  justify-content: flex-end;
  padding: 0.1rem 0.8rem;
}

ul.sidebar-panel-nav {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

ul.sidebar-panel-nav > li {
  color: #000000;
  text-decoration: none;
  font-size: 1.5rem;
  display: block;
  cursor: pointer;
  min-width: 100px;
  // padding-bottom: 0.5em;style=" margin-top:5px"
}
li:hover {
  background-color: #fff;
}
</style>
