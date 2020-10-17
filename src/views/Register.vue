<template>
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-8">
        <div class="card text-white bg-dark mt-5">
          <div class="card-header">Register</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form @submit.prevent="register">
              <div class="form-group row">
                <div class="col">
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    class="form-control"
                    name="username"
                    required
                    autofocus
                    v-model="user.username"
                  />
                </div>
              </div>

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
                  <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    class="form-control"
                    name="confirm-password"
                    required
                    v-model="user.confirmPassword"
                  />
                </div>
              </div>
              <div class="form-group row">
                <div class="col">
                  <button class="btn btn-outline-light btn-block">
                    Register
                  </button>
                </div>
              </div>
              <div class="form-group row my-0 py-0">
                <div class="col text-center">
                  <router-link to="login" class="my-0 py-0" id="login-link"
                    >Log in to your account</router-link
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
  name: "Register",
  data() {
    return {
      user: { username: "", email: "", password: "", confirmPassword: "" },
      error: null,
    };
  },
  methods: {
    register() {
      if (this.user.password == this.user.confirmPassword) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.user.email, this.user.password)
          .then((res) => {
            res.user
              .updateProfile({
                displayName: this.user.username,
              })
              .then(() => {
                db.collection("users").doc(res.user.uid).set({
                  userId: res.user.uid,
                  displayName: this.user.username,
                  recentlyPlayed: [],
                  suggestions: [],
                  friends: [],
                  invitations: [],
                });
                this.$store.dispatch("fetchUser", res.user);
                this.$router.push("/profile");
              });
          })
          .catch((error) => {
            this.error = error.message;
            console.log("err", error);
          });
      } else {
        this.error = "Password and password confirmation don't match.";
      }
    },
  },
};
</script>
<style>
#login-link {
  color: #aaaaaa;
  text-decoration: none;
}
#login-link:hover {
  color: white;
}
</style>
