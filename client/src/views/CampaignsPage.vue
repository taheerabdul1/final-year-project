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
        <button @click="redirect()" class="btn btn-primary">Donate</button>
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
    // retrieve all the campaigns for the users chosen mosque
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
    redirect(){
      this.$router.push("/makeDonation");
    },
    // format the date in a readable format
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
};
</script>

<style scoped lang="scss">
// align the announcements vertically in the centre of the page
.campaign-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// the following selectors style each card
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

// make the card as wide as the screen on smaller screens
@media screen and (max-width: 768px) {
  .card {
    width: 99%;
  }
}
</style>
