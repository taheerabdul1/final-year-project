<template>
  <nav class="navbar navbar-expand-md bg-body-tertiary">
    <div class="container-fluid">
      <router-link @click="closeNavbar" to="/" class="navbar-brand"
        >FundMosque</router-link
      >
      <router-link
        v-if="user.isLoggedIn"
        @click="logout"
        class="nav-item nav-link"
        to="/logout"
        >Logout</router-link
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse"
        :class="{ show: isNavbarOpen }"
        id="navbarSupportedContent"
      >
        <div class="navbar-nav mx-auto">
          <router-link
            v-if="user.isLoggedIn"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/makeDonation"
            >Make a Donation</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/profile"
            >View Profile</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/mosquesInfo"
            >View Mosques</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/campaigns"
            >View Campaigns</router-link
          >
          <router-link
            v-if="user.isLoggedIn"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/announcements"
            >View Announcements</router-link
          >
          <router-link
            v-if="user.isLoggedIn && user.isAdmin"
            @click="closeNavbar"
            class="nav-item nav-link"
            to="/adminDashboard"
            >Admin Dashboard</router-link
          >
          <router-link
            class="nav-item nav-link"
            to="/register"
            v-if="!user.isLoggedIn"
            @click="closeNavbar"
            >Register</router-link
          >
          <router-link
            class="nav-item nav-link"
            to="login"
            v-if="!user.isLoggedIn"
            @click="closeNavbar"
            >Login</router-link
          >
        </div>
        <button
          class="btn btn-secondary"
          id="darkModeButton"
          @click="toggleTheme"
        >
          {{ theme === "dark" ? "Light Mode" : "Dark Mode" }}
        </button>
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
import { onMounted, ref } from "vue";
import { useUserStore } from "./store/index";
export default {
  setup() {
    const user = useUserStore();
    const isNavbarOpen = ref(false);
    const theme = ref("");
    const toggleNavbar = () => {
      isNavbarOpen.value = !isNavbarOpen.value;
    };

    const closeNavbar = () => {
      isNavbarOpen.value = false;
    };

    const toggleTheme = () => {
      theme.value = theme.value === "dark" ? "light" : "dark";
      localStorage.setItem("theme", theme.value);
      applyTheme();
    };

    const applyTheme = () => {
      const themeAttribute = theme.value === "dark" ? "dark" : "light";
      document.body.setAttribute("data-bs-theme", themeAttribute);
    };

    onMounted(async () => {
      await user.loggedIn();
      theme.value = localStorage.getItem("theme") || "dark";
      applyTheme();
    });

    return {
      user,
      isNavbarOpen,
      theme,
      toggleNavbar,
      closeNavbar,
      toggleTheme,
    };
  },
};
</script>
