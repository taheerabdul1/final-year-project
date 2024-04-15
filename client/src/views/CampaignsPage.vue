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
      chosenMosqueName: "",
      campaignList: [],
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      if (!this.user || !this.user.chosenMosqueId) {
        return;
      }

      try {
        // Fetch the chosen mosque data
        const mosqueResponse = await fetch(`/api/mosques/${this.user.chosenMosqueId}`);
        if (!mosqueResponse.ok) {
          throw new Error("Failed to fetch mosque data");
        }
        const mosqueData = await mosqueResponse.json();
        this.chosenMosqueName = mosqueData.name;

        // Fetch all campaigns and filter them by the chosen mosque id.
        const campaignsResponse = await fetch(`/api/campaigns/${this.user.chosenMosqueId}`);
        if (!campaignsResponse.ok) {
          throw new Error("Failed to fetch campaigns");
        }
        const campaignsData = await campaignsResponse.json();
        this.campaignList = campaignsData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
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
