<template>
  <h1>View Campaigns</h1>
  <h2 v-if="campaignList.length == 0">Wow... so empty...</h2>
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
        <a href="/makeDonation" class="btn btn-primary">Donate</a>
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
      campaignList: [],
    };
  },
  created() {
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
.campaign-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 600px;
  margin-bottom: 16px;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.status {
  font-size: 14px;
  margin-bottom: 16px;
}

button {
  margin-right: 8px;
}

@media screen and (max-width: 768px) {
  .card {
    width: 99%;
  }
}
</style>
