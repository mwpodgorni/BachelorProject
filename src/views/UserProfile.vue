<template>
  <div class="container" id="profile" v-if="viewedUser">
    <div class="row" id="username-row">
      <div class="col">
        <h1 class="my-3">{{viewedUser.username}}</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <b-icon class="icon mr-3" icon="person-plus"></b-icon>

        <router-link to="messages">
          <b-icon class="icon mr-1" icon="chat-left-text"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="recentlyPlayedUser-row">
      <div class="col px-0">
        <h3 class="mx-auto my-2 text-center">Recently Played</h3>
        <div
          class="row text-center align-items-center mx-0"
          id="no-activity"
          v-if="!viewedUser.recentlyPlayed.length"
        >
          <div class="col px-0">
            <h4 class="my-auto py-auto">No recent activity</h4>
          </div>
        </div>
        <b-list-group id="recentlyPlayedUser-list" v-if="viewedUser.recentlyPlayed.length">
          <b-list-group-item
            variant="dark"
            class="px-1"
            v-for="item in viewedUser.recentlyPlayed"
            :key="item.title"
          >
            <div class="row mx-0" id="recentlyPlayedUser-item">
              <div class="col-9">
                <div class="row m-0 p-0">
                  <div class="col m-0 p-0">{{ item.title }}</div>
                </div>
                <div class="row m-0 p-0">
                  <div class="col m-0 p-0">
                    Last played on:
                    {{ item.lastPlayed }}
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
</template>
<script>
export default {
  name: "UserProfile",
  data() {
    return {
      viewedUser:null,
      recentlyPlayed: [
        {
          title: "Game Title 1",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 2",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 3",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 4",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 5",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 6",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 7",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 8",
          lastPlayed: "16.04.2020",
        },
        {
          title: "Game Title 9",
          lastPlayed: "16.04.2020",
        },
      ],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm)=>{
      vm.initializeSearch(vm);
    })
  },
  methods:{
    chooseUser: function (user) {
      console.log("user profile", user);
    },
    setViewedUser(data){
      this.viewedUser=data;
    },
    initializeSearch(vm){
       var keyword = vm.$route.params.username;
      db.collection("users").doc(keyword)
      .get()
      .then(function (doc){
        if(doc.exists){
          vm.setViewedUser(doc.data());
        }else{
          console.log("No such document!");
        }
      }).catch(function(error) {
         console.log("Error getting document:", error);
      });
      // .get(vm.user.userId)
      // .then(function (querySnapshot){
      //   querySnapshot.forEach(function(doc){
      //   console.log("used", doc())
      //   })
      // })
      // .catch(function (error){
      //   console.log("Error getting documents: ", error);
      // });
    }
  },
};
</script>
<style>
#profile * {
  color: white;
}
#profile {
  display: flex;
  flex-flow: column;
  height: 100%;
}
#username-row,
#recentlyPlayedUser-item {
  background-color: #636a70;
}
#recentlyPlayedUser-row {
  background-color: #32383e;
}
#no-activity {
  height: 270px;
  background-color: #636a70;
}
#recentlyPlayedUser-list {
  overflow-y: auto;
  flex-grow: 1;
  height: 550px;
}
</style>