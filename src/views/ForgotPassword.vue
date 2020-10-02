<template>
  <div class="container h-100">
    <div class="row justify-content-center h-100">
      <div class="col-md-8">
        <div class="card text-white bg-dark mt-5">
          <div class="card-header">Reset Password</div>
          <div class="card-body">
            <div v-if="success" class="alert alert-success">
              {{ success }}
            </div>
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form @submit.prevent="forgetPassword">
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
                  <button class="btn btn-outline-light btn-block">
                    Reset Password
                  </button>
                </div>
              </div>
              <div class="form-group row my-0 py-0">
                <div class="col-6 text-center">
                  <router-link to="login" class="my-0 py-0" id="login-link"
                    >Login</router-link
                  >
                </div>
                <div class="col-6 text-center">
                  <router-link to="register" class="my-0 py-0" id="login-link"
                    >Create new account</router-link
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
  data() {
    return {
      user: {
        email: "",
      },
      error: null,
      success: null,
    };
  },
  methods: {
    forgetPassword() {
      firebase
        .auth()
        .sendPasswordResetEmail(this.user.email)
        .then(() => {
          this.success = "Check your registered email to reset the password.";
          this.user = {
            email: "",
          };
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
  },
};
</script>
<style></style>
