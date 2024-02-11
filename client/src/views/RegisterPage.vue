<template>
  <h1>Register</h1>
  <form @submit.prevent="register" class="register-form">
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input class="form-control" v-model="username" type="text" required />
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Full Name</label>
      <input class="form-control" v-model="name" type="text" required />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input class="form-control" v-model="email" type="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input class="form-control" v-model="password" type="password" required />
    </div>
    <button class="btn btn-primary" type="submit">Register</button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      name: "",
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        const response = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            name: this.name,
            email: this.email,
            password: this.password,
          }),
        });
        const data = await response.json();
        if (data.success) {
          this.$router.push("/");
          alert("Registration successful");
        } else {
          alert("uh oh, try again!");
        }
      } catch (err) {
        console.log(err);
        alert("Registration failed");
      }
    },
  },
};
</script>
<style>
  .register-form{
    width:20rem;
  }
</style>
