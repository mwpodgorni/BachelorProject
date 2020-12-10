import Vue from "vue";
import Router from "vue-router";

import Games from "../views/Games";

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
      component: () => import("@/views/Game"),
    },
    {
      path: "/games/details/:gameId",
      name: "game-details",
      component: () => import("@/views/GameDetails"),
    },
    {
      path: "/search/:keyword",
      name: "search",
      component: () => import("@/views/SearchResults"),
    },
    {
      path: "/user-profile/:username",
      name: "user-profile",
      component: () => import("@/views/UserProfile"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("@/views/Profile"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/edit-profile",
      name: "edit-profile",
      component: () => import("@/views/EditProfile"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/chat/:userId?",
      name: "chat",
      component: () => import("@/views/Chat"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login"),
      meta: {
        disableIfLoggedIn: true,
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/Register"),
      meta: {
        disableIfLoggedIn: true,
      },
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () => import("@/views/ForgotPassword"),
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
