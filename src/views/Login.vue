<template>
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-8">
        <div class="card text-white bg-dark mt-5">
          <div class="card-header">Login</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form @submit.prevent="login">
              <div class="form-group row">
                <div class="col">
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    class="form-control"
                    name="email"
                    required
                    v-model="user.email"
                  />
                </div>
              </div>
              <div class="form-group row">
                <div class="col">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    class="form-control"
                    name="password"
                    required
                    v-model="user.password"
                  />
                </div>
              </div>
              <div class="form-group row">
                <div class="col">
                  <button class="btn btn-outline-light btn-block">Login</button>
                </div>
              </div>
              <div class="form-group row my-0 py-0">
                <div class="col-6 text-center">
                  <router-link to="register" class="my-0 py-0" id="login-link"
                    >Create new account</router-link
                  >
                </div>
                <div class="col-6 text-center">
                  <router-link
                    to="forgot-password"
                    class="my-0 py-0"
                    id="login-link"
                    >Forgot password</router-link
                  >
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Login",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      error: null,
    };
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.user.email, this.user.password)
        .then((user) => {
          this.$store.dispatch("fetchUser", user.user);
          this.$store.dispatch("fetchUserData", user.user);
          this.$router.replace({ name: "profile" });
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
  },
};
</script>
<style></style>
