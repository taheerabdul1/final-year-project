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
    <div class="mb-3">
      <label for="chosenMosque">Choose your preferred Mosque</label>
      <select
        id="chosenMosque"
        name="chosenMosque"
        v-model="chosenMosque"
        class="form-control"
        required
      >
        <option value="" disabled selected>
          Click here to select a mosque
        </option>
        <option v-for="mosque in mosques" :key="mosque._id" :value="mosque._id">
          {{ mosque.name }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="isAdmin" class="form-label">Are you an admin?</label>
      <input type="checkbox" v-model="isAdmin" />
    </div>
    <div class="mb-3" v-if="isAdmin">
      <label for="adminPasscode" class="form-label">Admin Passcode</label>
      <input
        class="form-control"
        v-model="adminPasscode"
        type="password"
        required
      />
    </div>
    <button class="btn btn-primary" type="submit">Register</button>
  </form>
</template>

<script>
import router from "../router/index";
import {useUserStore} from "../store/index";

export default {
  data() {
    return {
      username: "",
      name: "",
      email: "",
      password: "",
      isAdmin: false,
      adminPasscode: "",
      chosenMosque: "",
      mosques: [],
    };
  },
  created() {
    fetch("/api/mosques")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.mosques = data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    async register() {
      const user = useUserStore();
      let newuser = {
        username: this.username,
        name: this.name,
        email: this.email,
        password: this.password,
        isAdmin: this.isAdmin,
        adminPasscode: this.adminPasscode,
        chosenMosque: this.chosenMosque,
      };
      console.log(newuser)
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newuser),
        });
        const data = await response.json();
        if (data.success) {
          await user.loggedIn();
          router.push("/");
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
.register-form {
  width: 20rem;
}
</style>
