<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header"><h3>Register</h3></div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div v-if="success" class="alert alert-success">Success</div>
            <form @submit.prevent="submit">
              <div class="form-group row">
                <label for="name" class="col-md-4 col-form-label text-md-right"
                  >Username</label
                >
                <div class="col-md-6">
                  <input
                    id="username"
                    type="text"
                    class="form-control"
                    name="username"
                    required
                    autofocus
                    v-model="registration.username"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right"
                  >Email</label
                >

                <div class="col-md-6">
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    name="email"
                    required
                    v-model="registration.email"
                  />
                </div>
              </div>

              <div class="form-group row">
                <label
                  for="password"
                  class="col-md-4 col-form-label text-md-right"
                  >Password</label
                >

                <div class="col-md-6">
                  <input
                    id="password"
                    type="text"
                    class="form-control"
                    name="password"
                    required
                    v-model="registration.password"
                  />
                </div>
              </div>
              <div class="form-group row">
                <label
                  for="confim-password"
                  class="col-md-4 col-form-label text-md-right"
                  >Confirm Password</label
                >

                <div class="col-md-6">
                  <input
                    id="confirm-password"
                    type="text"
                    class="form-control"
                    name="confirm-password"
                    required
                    v-model="registration.confirmPassword"
                  />
                </div>
              </div>

              <div class="form-group row mb-0">
                <div class="col-md-4 offset-md-4 mt-3">
                  <button
                    type="submit"
                    class="btn"
                    id="register-button"
                  >
                    Register
                  </button>
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
      registration: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      error: null,
      success: null,
    };
  },
  methods: {
    submit() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.registration.email,
          this.registration.password
        )
        .then((data) => {
          this.success = true;
          data.user
            .updateProfile({
              displayName: this.registration.username,
            })
            .then(() => {});
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
};
</script>

<style scoped>
.container {
  background: transparent;
}

.card-header h3 {
  color: black;
}

#register-button {
  width: 100%;
  background-image: linear-gradient(to right, #30cfd0 0%, #309bd0 51%, #330867 100%);
  color: white;
  border: 0px;
}

</style>
