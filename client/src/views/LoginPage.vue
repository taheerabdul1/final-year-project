<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input
          id="username"
          class="form-control"
          type="text"
          v-model="userStore.username"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label" for="password">Password</label>
        <input
          id="password"
          class="form-control"
          type="password"
          v-model="userStore.password"
          required
        />
      </div>
      <button class="btn btn-primary" type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from "../store/index";

export default {
  name: "LoginPage",
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  methods: {
    login() {
      this.userStore.login();
      this.userStore.username = "";
      this.userStore.password = "";
    },
  },
};
</script>

<style>
.login-form {
  width: 20rem;
}
</style>
