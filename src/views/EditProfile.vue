<template>
  <div class="container" id="edit-profile">
    <div class="row" id="header">
      <div class="col">
        <h1 class="my-3 label">Edit Profile</h1>
      </div>
      <div class="col-2 my-auto d-flex justify-content-end">
        <router-link to="profile">
          <b-icon class="icon mr-1" icon="arrow-left"></b-icon>
        </router-link>
      </div>
    </div>
    <div class="row" id="current-password">
      <div class="col my-3">
        <b-alert
          class="mb-1"
          :show="dismissCountDownUsername"
          variant="success"
          @dismissed="dismissCountDownUsername = 0"
        >
          {{ usernameSuccess }}
        </b-alert>
        <b-alert
          class="mb-1"
          :show="dismissCountDownEmail"
          variant="success"
          @dismissed="dismissCountDownEmail = 0"
        >
          {{ emailSuccess }}
        </b-alert>
        <b-alert
          class="mb-1"
          :show="dismissCountDownEmail"
          variant="success"
          @dismissed="dismissCountDownPassword = 0"
        >
          {{ passwordSuccess }}
        </b-alert>
        <b-alert
          class="mb-1"
          :show="dismissCountDownError"
          variant="danger"
          @dismissed="dismissCountDownError = 0"
        >
          {{ error }}
        </b-alert>
        <b-form-group
          class="mb-0 label"
          label="To make any changes enter your current password before submitting:"
        >
          <b-form-input
            type="password"
            id="input-formatter"
            v-model="password"
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>
      </div>
    </div>
    <div class="row" id="form">
      <div class="col my-3">
        <b-form-group
          class="label"
          label-cols-sm="3"
          label="Username:"
          label-align-sm="right"
          label-for="username"
        >
          <b-form-input
            v-model="userData.data.displayName"
            id="username"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          class="label"
          label-cols-sm="3"
          label="Email:"
          label-align-sm="right"
          label-for="email"
        >
          <b-form-input v-model="userData.data.email" id="email"></b-form-input>
        </b-form-group>

        <b-form-group
          class="label"
          label-cols-sm="3"
          label="New Password:"
          label-align-sm="right"
          label-for="new-password"
        >
          <b-form-input
            v-model="newPassword"
            type="password"
            id="new-password"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          class="label"
          label-cols-sm="3"
          label="Confirm Password:"
          label-align-sm="right"
          label-for="confirm-password"
        >
          <b-form-input
            v-model="confirmNewPassword"
            type="password"
            id="confirm-password"
          ></b-form-input>
          <b-button @click.prevent="update" variant="outline-light" class="mt-2"
            >Save</b-button
          >
          <b-button
            v-b-modal.modal-delete-account
            variant="outline-danger"
            class="mt-2 float-right"
            >Delete Account</b-button
          >
        </b-form-group>
        <div>
          <b-modal
            id="modal-delete-account"
            size="md"
            hide-backdrop
            centered
            title="Delete Account"
          >
            <p class="my-4">
              Are you sure you want to delete your account? Account and all your
              data will be deleted permanently.
            </p>
            <template v-slot:modal-footer="{ close }">
              <b-button
                @click.prevent="deleteAccount"
                class="mr-auto"
                variant="outline-danger"
              >
                Confirm
              </b-button>
              <b-button variant="outline-dark" @click="close()">
                Cancel
              </b-button>
            </template>
          </b-modal>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
export default {
  data() {
    return {
      dismissSecs: 5,
      dismissCountDownUsername: 0,
      dismissCountDownEmail: 0,
      dismissCountDownPassword: 0,
      dismissCountDownError: 0,
      error: null,
      usernameSuccess: "Username has been updated.",
      emailSuccess: "Email has been updated.",
      passwordSuccess: "Password has been updated.",
      password: "",
      newPassword: "",
      users: null,
      confirmNewPassword: "",
    };
  },
  methods: {
    showUsernameAlert() {
      this.dismissCountDownUsername = this.dismissSecs;
    },
    showEmailAlert() {
      this.dismissCountDownEmail = this.dismissSecs;
    },
    showPasswordAlert() {
      this.dismissCountDownPassword = this.dismissSecs;
    },
    showErrorAlert() {
      this.dismissCountDownError = this.dismissSecs;
    },
    check() {
      // @click.prevent="check"
      console.log(this.userUpdate);
    },
    update() {
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.password
      );
      // Prompt the user to re-provide their sign-in credentials
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          // User re-authenticated.
          // console.log(authenticatedUser);
          if (this.userData.data.displayName != user.displayName) {
            console.log("username", this.usernameSuccess);
            user
              .updateProfile({
                displayName: this.userData.data.displayName,
              })
              .then(() => {
                this.showUsernameAlert();
              })
              .catch((error) => {
                this.error = error.message;
                this.showErrorAlert();
              });
          }
          if (this.userData.data.email != user.email) {
            console.log("email");
            user
              .updateEmail(this.userData.data.email)
              .then(() => {
                this.showEmailAlert();
              })
              .catch((error) => {
                this.error = error.message;
                this.showErrorAlert();
              });
          }
          if (this.newPassword != "") {
            if (this.newPassword == this.confirmNewPassword) {
              console.log("password");
              if (this.password != this.newPassword) {
                user
                  .updatePassword(this.newPassword)
                  .then(() => {
                    this.showPasswordAlert();
                  })
                  .catch((error) => {
                    this.error = error.message;
                    this.showErrorAlert();
                  });
              } else {
                this.error = "New password cannot be the same as old password.";
                this.showErrorAlert();
              }
            } else {
              this.error = "New password and password confirmation don't match";
              this.showErrorAlert();
            }
          }
        })
        .catch((error) => {
          this.error = error.message;
          this.showErrorAlert();
        });
    },
    deleteAccount() {
      console.log("confirmed");
      var user = firebase.auth().currentUser;
      var credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        this.password
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          user
            .delete()
            .then(() => {
              this.$store.dispatch("fetchUser", null);
              this.$store.dispatch("fetchUserData", null);
              this.$router.replace({ name: "games" });
            })
            .catch((error) => {
              this.error = error.message;
              this.showErrorAlert();
            });
        })
        .catch((error) => {
          this.error = error.message;
          this.showErrorAlert();
        });
    },
  },
  computed: {
    // map `this.user` to `this.$store.getters.user`
    ...mapGetters({
      userData: "user",
    }),
  },
};
</script>
<style>
#edit-profile {
  display: flex;
  flex-flow: column;
  height: 100%;
  background-color: #32383e;
}

.label {
  color: white;
}

#current-password {
  background-color: #949292;
}
</style>
