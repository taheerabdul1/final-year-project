<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand">FundMosque</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav mx-auto">
          <router-link to="/" class="nav-item nav-link">Home</router-link>
          <router-link
            v-if="user.isLoggedIn"
            class="nav-item nav-link"
            to="/makeDonation"
            >Make a Donation</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            class="nav-item nav-link"
            to="/profile"
            >View Profile</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            class="nav-item nav-link"
            to="/mosquesInfo"
            >View Mosques</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            class="nav-item nav-link"
            to="/adminDashboard"
            >Admin Dashboard</router-link
          >
          <router-link
            class="nav-item nav-link"
            to="/register"
            v-if="!user.isLoggedIn"
            >Register</router-link
          >
          <router-link
            class="nav-item nav-link"
            to="login"
            v-if="!user.isLoggedIn"
            >Login</router-link
          >
        </div>
        <button class="btn btn-secondary" id="darkModeButton" @click="toggleTheme">Dark Mode</button>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

nav {
  text-align: center;
  a {
    color: #2c3e50;
    &.router-link-exact-active {
      color: #0d6efd !important;
    }
  }
}
</style>
<script>
import { Collapse } from "bootstrap";
import { useUserStore } from "./store/index";
export default {
  setup() {
    const user = useUserStore();
    return { user, theme:"" };
  },
  mounted() {
    this.user.loggedIn();
    if (localStorage.getItem("theme") == "light") {
      this.theme = "light",
      localStorage.setItem("theme", "light");
      this.applyTheme();
    } else if (localStorage.getItem("theme") == "dark"){
      this.theme = "dark",
      localStorage.setItem("theme", "dark");
      this.applyTheme();
    } else {
      this.theme = "dark",
      localStorage.setItem("theme", "dark");
      this.applyTheme();
    }
    const navLinks = document.querySelectorAll('.nav-item')
    const menuToggle = document.getElementById('navbarSupportedContent')
    const bsCollapse = Collapse.getOrCreateInstance(menuToggle, {toggle: false})
    navLinks.forEach((l) => {
        l.addEventListener('click', () => { bsCollapse.toggle() })
})
  },  
  methods: {
    toggleTheme() {
      if (this.theme=="light"){
        this.theme="dark";
        localStorage.setItem("theme", "dark");
      } else {
        this.theme="light";
        localStorage.setItem("theme", "light");
      }
      this.applyTheme();
    },
    applyTheme(){
      if(this.theme == "dark"){
        document.body.setAttribute("data-bs-theme","dark");
        document.getElementById("darkModeButton").innerText="Light Mode";
      } else {
        document.body.setAttribute("data-bs-theme","light");
        document.getElementById("darkModeButton").innerText="Dark Mode";
      }
    }
  }
};
</script>
