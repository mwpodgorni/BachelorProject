<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div id="main-card" class="card">
          <div class="card-header"><h3>Register</h3></div>
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

              <div class="form-group row mb-0">
                <div class="col mt-2">
                  <button type="submit" class="btn btn-outline-light btn-block">
                    Register
                  </button>
                </div>
              </div>
              <div class="form-group row my-0 py-0">
                <div class="col text-center mt-2">
                  <router-link to="login" class="my-0 py-0" id="login-link"
                    >Already have an account?</router-link
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
import { mapGetters } from "vuex";

export default {
  name: "Register",
  data() {
    return {
      user: { username: "", email: "", password: "", confirmPassword: "" },
      error: null,
    };
  },
  computed: {
    ...mapGetters({ loggedInUser: "user" }),
  },
  methods: {
    register() {
      if (this.user.password == this.user.confirmPassword) {
        this.$store.dispatch("signUp", {
          email: this.user.email,
          password: this.user.password,
          username: this.user.username,
        });
        console.log(this.loggedInUser);
        if (this.loggedInUser) {
          this.$router.push({ name: "profile" });
        }
        // firebase
        //   .auth()
        //   .createUserWithEmailAndPassword(this.user.email, this.user.password)
        //   .then((res) => {
        //     res.user
        //       .updateProfile({
        //         displayName: this.user.username,
        //       })
        //       .then(() => {
        //         db.collection("users")
        //           .doc(res.user.uid)
        //           .set({
        //             userId: res.user.uid,
        //             displayName: this.user.username,
        //             recentlyPlayed: [],
        //             suggestions: [],
        //             friends: [],
        //             invitations: [],
        //           });
        //         this.$router.push({ name: "profile" });
        //       });
        //   })
        //   .catch((error) => {
        //     this.error = error.message;
        //     console.log("err", error);
        //   });
      } else {
        this.error = "Password and password confirmation don't match.";
      }
    },
  },
};
</script>

<style scoped>
.container {
  background: transparent;
}

.card-header h3 {
  color: white;
}
</style>
