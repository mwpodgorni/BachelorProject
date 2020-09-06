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
          <div class="col text-center px-0" style="height:100%;">
            <div>
              <vue-horizontal-list
                :items="items"
                :options="{
                  responsive: [
                    { end: 576, size: 1 },
                    { start: 576, end: 768, size: 2 },
                    { size: 3 },
                  ],
                }"
              >
                <template v-slot:default="{ item }">
                  <div>
                    <div class="aspect r-5-3 border-3 overflow-hidden">
                      <img class="suggestion-image" :src="item.image" />
                    </div>

                    <h5>{{ item.title }}</h5>
                    <p class=" text-ellipsis-2l">{{ item.content }}</p>
                  </div>
                </template>
              </vue-horizontal-list>
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
import VueHorizontalList from "vue-horizontal-list";
export default {
  components: { VueHorizontalList },
  data() {
    return {
      userData: userData,
      items: [
        {
          title: "Sed non ante non cras amet",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non sagittis leo. Vestibulum sit amet metus nec neque dignissim dapibus.",
          image: "https://picsum.photos/id/1015/600/600",
        },
        {
          title: "Curabitur sit amet nunc",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id mollis erat. Aliquam erat volutpat. Nunc erat lacus, rhoncus nec.",
          image: "https://picsum.photos/id/1019/600/600",
        },
        {
          title: "Proin pharetra, ante metus",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac diam ac ex efficitur posuere. Pellentesque cursus pellentesque risus, non.",
          image: "https://picsum.photos/id/1039/600/600",
        },
        {
          title: "Cras pharetra non enim a",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi malesuada varius nibh, a malesuada nisi feugiat eget. Aenean convallis semper.",
          image: "https://picsum.photos/id/1042/600/600",
        },
        {
          title: "Proin vulputate, augue eu accumsan",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla tempor libero sit amet mollis. Praesent quis leo erat. Integer.",
          image: "https://picsum.photos/id/1044/600/600",
        },
        {
          title: "Maecenas feugiat magna sapien in",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit amet fringilla ante. Quisque at ipsum non lacus consequat dictum.",
          image: "https://picsum.photos/id/1057/600/600",
        },
        {
          title: "Donec commodo sed enim at",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu condimentum risus. Praesent dignissim, neque nec pharetra vestibulum, libero odio.",
          image: "https://picsum.photos/id/1063/600/600",
        },
        {
          title: "In bibendum urna et turpis",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae ante volutpat leo vulputate volutpat et sed ex. Vivamus eu.",
          image: "https://picsum.photos/id/1076/600/600",
        },
        {
          title: "Phasellus iaculis dignissim erat at",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla mattis quam scelerisque, eleifend purus gravida, scelerisque orci. Ut et turpis.",
          image: "https://picsum.photos/id/1083/600/600",
        },
      ],
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

section > div {
  margin-top: 24px;
  margin-bottom: 24px;
}
.Banner {
  background-image: url("https://picsum.photos/id/1011/2000/500");
}
.background-image {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.suggestion-image {
  object-fit: cover;
  width: 50%;
  height: 50%;
}
.ImageBoxed {
  flex: 0 0 25%;
  max-width: 25%;
}
</style>
