import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import firebase from "firebase";
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

defineIonPhaser(window);

firebase.initializeApp({
  apiKey: "AIzaSyBqPvdfLKfnm_-9K6t-cRwu_35jzova9fU",
  authDomain: "jugsquare-1.firebaseapp.com",
  databaseURL: "https://jugsquare-1.firebaseio.com",
  projectId: "jugsquare-1",
  storageBucket: "jugsquare-1.appspot.com",
  messagingSenderId: "15561258022",
  appId: "1:15561258022:web:7e864062a9d3324530e2e7",
  measurementId: "G-YWP9QLLEGV",
});
let app;
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch("fetchUser", user);
  } else {
    store.dispatch("logout");
  }
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
