import Vue from "vue";
import Router from "vue-router";
import Login from "../views/Login";
import Register from "../views/Register";
import ForgotPassword from "../views/ForgotPassword";
import SearchResults from "../views/SearchResults";
import Games from "../views/Games";
import Game from "../views/Game";
import GameDetails from "../views/GameDetails";
import Profile from "../views/Profile";
import EditProfile from "../views/EditProfile";
import UserProfile from "../views/UserProfile";
import Chat from "../views/Chat";
import store from "../store";
Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/games",
    },
    {
      path: "/games",
      name: "games",
      component: Games,
    },
    {
      path: "/games/:game",
      name: "game",
      component: Game,
    },
    {
      path: "/details",
      name: "details",
      component: GameDetails,
    },
    {
      path: "/search/:keyword",
      name: "search",
      component: SearchResults,
    },
    {
      path: "/user-profile/:username",
      name: "user-profile",
      component: UserProfile,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/edit-profile",
      name: "edit-profile",
      component: EditProfile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/chat/:userId?",
      name: "chat",
      component: Chat,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        disableIfLoggedIn: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        disableIfLoggedIn: true,
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: ForgotPassword,
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.user.loggedIn) {
      next({ name: "login" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
  if (to.meta.disableIfLoggedIn) {
    if (store.getters.user.loggedIn) {
      next({ name: "profile" });
    } else {
      next(); // go to wherever I'm going
    }
  }
});
export default router;
