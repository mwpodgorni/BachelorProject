<template>
  <b-container id="wrapper" class="p-5">
    <b-row class="py-2">
      <b-col>
        <h1>Edit Profile</h1>
      </b-col>
    </b-row>
    <b-row class="py-2">
      <b-col>
        <b-form-group
          class="mb-0"
          label="To make any changes enter your current password:"
        >
          <b-form-input
            id="input-formatter"
            v-model="text1"
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="py-3">
      <b-col>
        <b-form-group
          label-cols-sm="3"
          label="Username:"
          label-align-sm="right"
          label-for="username"
        >
          <b-form-input id="username"></b-form-input>
        </b-form-group>

        <b-form-group
          label-cols-sm="3"
          label="Email:"
          label-align-sm="right"
          label-for="email"
        >
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
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset="3"><b-button variant="primary">Save</b-button></b-col>
      <b-col><b-button variant="danger">Delete Account</b-button></b-col>
    </b-row>
  </b-container>
</template>
<script>
export default {};
</script>
<style>
#wrapper {
  height: 100%;
  background-color: #343a40;
  color: white;
}
</style>
