<template>
  <div class="container-fluid" id="search-results">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <h3 class="mx-auto my-2 text-center">Users</h3>
        <div class="row text-center align-items-center mx-0" v-if="false">
          <div class="col px-0">
            <h4 class="my-auto py-auto">No users for search keyword</h4>
          </div>
        </div>
        <b-list-group v-if="true" id="search-users">
          <b-list-group-item
            variant="dark"
            class="mx-1 text-center my-1"
            v-for="item in searchUsers"
            :key="item.username"
          >
            {{ item.username }}
          </b-list-group-item>
        </b-list-group>
      </div>
      <div class="col-sm-12 col-md-6"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchResults",
  data() {
    return {
      searchUsers: [
        { username: "User1" },
        { username: "User2" },
        { username: "User3" },
        { username: "User4" },
        { username: "User5" },
        { username: "User6" },
        { username: "User7" },
        { username: "User8" },
        { username: "User4" },
        { username: "User5" },
        { username: "User6" },
        { username: "User7" },
        { username: "User8" },
      ],
    };
  },
};
</script>
<style>
#search-results {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #32383e;
}
#search-results * {
  color: white;
}
#search-users {
  flex-grow: 1;
  overflow-y: auto;
}
</style>