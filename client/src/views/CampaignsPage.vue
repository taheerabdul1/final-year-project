<template>
  <h1>Campaigns</h1>
  <p>Campaigns are efforts to raise funds for a particular cause.</p>
  <p>Below are some of the campaigns for your chosen mosque, {{ chosenMosqueName }}.</p>
</template>
<script>
import { useUserStore } from "../store/index";

export default {
    setup() {
        const user = useUserStore();
        return {
            user,
        }
    },
  data() {
    return {
        chosenMosqueName: "",
        campaignList: [],
    };
  },
  created() {
    fetch(`/api/mosques/${this.user.chosenMosque}`)
      .then((response) => {
        if (!response.ok) {
          throw response;
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.chosenMosqueName = data.name;
      });
  },
  methods: {},
};
</script>
