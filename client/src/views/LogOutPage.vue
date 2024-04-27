<template>
  <h1>Logged out successfully!</h1>
  <button class="btn btn-primary" @click="redirectHome()">Click here to go home</button>
</template>
<script>
import { useUserStore } from "../store/index";
export default {
  name: "LogOutPage",
  data() {
    const user = useUserStore();
    return { user };
  },
  setup() {
    function logout() {
      this.user.logout()
    }
    return {logout}
  },
  mounted() {
    this.logout();
  },
  methods: {
    redirectHome(){
      this.$router.push("/");
    }
  }
};
</script>
<style scoped lang="scss">
h1 {
  text-align: center;
  font-size: 2em;
}
</style>
