<template>
  <div class="campaign-list">
    <div class="card" v-for="campaign in campaignList" :key="campaign._id">
      <div class="card-body">
        <h5 class="card-title">{{ campaign.name }}</h5>
        <p class="card-text">{{ campaign.description }}</p>
        <p class="card-text status">
          Goal: {{ campaign.goal }} <br />
          Raised: {{ campaign.raisedAmount }} <br />
          Start Date: {{ formatDate(campaign.startDate) }} <br />
          End Date: {{ formatDate(campaign.endDate) }}
        </p>
        <a href="#" class="btn btn-primary">Donate</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../store/index";

export default {
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      chosenMosqueName: "",
      campaignList: [],
    };
  },
  created() {
    fetch(`/api/mosques/${this.user.chosenMosqueId}`)
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
    // Fetch all campaigns and filter them by the chosen mosque id.
    fetch(`/api/campaigns/${this.user.chosenMosqueId}`)
      .then(function (response) {
        return response.json();
      })
      .then(
        function (data) {
          this.campaignList = data;
        }.bind(this)
      );
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  margin: 0 auto;
  margin-top: 1%;
  width: 32%;
  border-radius: 5px;
}

@media screen and (max-width: 768px) {
  .card {
    width: 99%;
  }
}
</style>