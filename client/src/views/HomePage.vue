<template>
  <div class="home">
    <h1>Welcome to FundMosque!</h1>
    <p v-if="!user.isLoggedIn">Please sign up or log in to continue.</p>
  </div>
  <div>
    <div class="logout">
      <p v-if="user.isLoggedIn">You are logged in as {{ user.username }}</p>
      <button class="btn btn-primary" @click="user.logout" v-if="user.isLoggedIn">Log Out</button>
    </div>
  </div>
  <div v-if="user.isLoggedIn">
    <DonationList />
  </div>
</template>

<script>
import { useUserStore } from "../store/index";
import DonationList from "../components/DonationList.vue";

export default {
  name: "HomePage",
  components: {
    DonationList,
  },
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
};
</script>
