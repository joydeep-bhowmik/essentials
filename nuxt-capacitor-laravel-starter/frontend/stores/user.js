import { $api } from "~/lib/$http";
import { defineStore } from "pinia";
import { navigateTo } from "#app";
import { setCookie } from "~/lib/$cookies";

export const useUsers = defineStore("users", {
  state: () => ({
    userData: null,
    authStatus: false,
  }),

  getters: {
    authUser: (state) => state.userData,
    hasUserData: (state) => Object.keys(state.userData).length > 0,
    hasVerified: (state) =>
      Object.keys(state.userData).length > 0
        ? state.userData.email_verified_at !== null
        : false,
  },

  actions: {
    async getUserData() {
      await $api("user")
        .then((response) => {
          console.log(response);
          this.userData = response.data;
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status !== 409) throw error;

          navigateTo("/verify-email");
        });
    },

    async register(form, setErrors, processing) {
      processing.value = true;

      $api("/register", {
        method: "post",
        params: form.value,
      })
        .then((response) => {
          this.authStatus = response.status;
          if (response.data.token) {
            setCookie("token", response.data.token, 30);
            this.getData();
            navigateTo("/dashboard");
          }
        })
        .catch((error) => {
          if (error.response.status !== 422) throw error;

          setErrors.value = Object.values(error.response.data.errors).flat();
        })
        .finally(() => (processing.value = false));
    },

    async login(form, setErrors, processing) {
      processing.value = true;

      $api("/login", {
        method: "post",
        params: form.value,
      })
        .then((response) => {
          this.authStatus = response.status;
          if (response.data.token) {
            setCookie("token", response.data.token, 30);
            this.getData();
            navigateTo("/dashboard");
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status !== 422) throw error;

          setErrors.value = Object.values(error.response.data.errors).flat();
        })
        .finally(() => (processing.value = false));
    },

    async forgotPassword(form, setStatus, setErrors, processing) {
      processing.value = true;

      $api("/forgot-password", {
        method: "post",
        params: form.value,
      })
        .then((response) => {
          setStatus.value = response.data.status;
        })
        .catch((error) => {
          if (error.response.status !== 422) throw error;

          setErrors.value = Object.values(error.response.data.errors).flat();
        })
        .finally(() => (processing.value = false));
    },

    async resetPassword(form, setErrors, processing) {
      processing.value = true;

      $api("/reset-password", {
        method: "post",
        params: form.value,
      })
        .then((response) => {
          navigateTo("/login?reset=" + btoa(response.data.status));
        })
        .catch((error) => {
          if (error.response.status !== 422) throw error;

          setErrors.value = Object.values(error.response.data.errors).flat();
        })
        .finally(() => (processing.value = false));
    },

    resendEmailVerification(setStatus, processing) {
      processing.value = true;

      $api("/email/verification-notification", {
        method: "post",
        params: form.value,
      })
        .then((response) => {
          setStatus.value = response.data.status;
        })
        .finally(() => (processing.value = false));
    },

    async logout() {
      await $api("/logout", {
        method: "post",
        params: form.value,
      })
        .then(() => {
          this.$reset();
          this.userData = {};
          this.authStatus = [];
          navigateTo("/welcome");
        })
        .catch((error) => {
          if (error.response.status !== 422) throw error;
        });
    },
  },
});
