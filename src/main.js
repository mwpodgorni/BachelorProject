import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import * as firebase from "firebase";
import { defineCustomElements as defineIonPhaser } from "@ion-phaser/core/loader";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/ion-\w*/];
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

defineIonPhaser(window);

const firebaseConfigOptions = {
  apiKey: "AIzaSyBbguNA-JpLCNM1z9zZid3UYuvrbFoKAUY",
  authDomain: "vue-firebase-auth-c1ff6.firebaseapp.com",
  databaseURL: "https://vue-firebase-auth-c1ff6.firebaseio.com",
  projectId: "vue-firebase-auth-c1ff6",
  storageBucket: "vue-firebase-auth-c1ff6.appspot.com",
  messagingSenderId: "589725106771",
  appId: "1:589725106771:web:512498f0aa8fe68c94bca6",
};
firebase.initializeApp(firebaseConfigOptions);

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
