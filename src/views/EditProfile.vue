<template>
  <div class="container">
    <div class="row" id="header">
      <div class="col">
        <h1 class="my-3">Edit Profile</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <router-link to="profile">
          <b-icon class="icon mr-1" icon="arrow-left"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="current-password">
      <div class="col my-3">
        <b-form-group
          class="mb-0"
          label="To make any changes enter your current password before submitting:"
        >
          <b-form-input id="input-formatter" v-model="text1" placeholder="Enter password"></b-form-input>
        </b-form-group>
      </div>
    </div>
    <div class="row" id="form">
      <div class="col my-3">
        <b-form-group
          label-cols-sm="3"
          label="Username:"
          label-align-sm="right"
          label-for="username"
        >
          <b-form-input id="username"></b-form-input>
        </b-form-group>

        <b-form-group label-cols-sm="3" label="Email:" label-align-sm="right" label-for="email">
          <b-form-input id="email"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="New Password:"
          label-align-sm="right"
          label-for="new-password"
        >
          <b-form-input id="new-password"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Confirm Password:"
          label-align-sm="right"
          label-for="confirm-password"
        >
          <b-form-input id="confirm-password"></b-form-input>
          <b-button variant="secondary" class="mt-2">Save</b-button>
          <b-button variant="danger" class="mt-2 float-right">Delete Account</b-button>
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style>
.container {
  min-height: 100%;
  height: auto;
  background-color: #595858;
}
.container * {
  color: white;
}
/* #header,
#form {
} */
#current-password {
  background-color: #949292;
}
</style>
