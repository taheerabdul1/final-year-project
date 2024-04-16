<template>
  <h1>Manage Campaigns</h1>
  <h2>Create Campaign</h2>
  <p>
    To create a campaign, <button class="btn btn-primary" @click="addCampaign()">Click here</button>
  </p>
  <h2>View Campaigns</h2>
  <p>Below are the campaigns for the mosque you are administrating</p>
  <div class="campaign-list">
    <div class="card" v-for="campaign in campaigns" :key="campaign._id">
      <div class="card-body">
        <h5 class="card-title">{{ campaign.name }}</h5>
        <p class="card-text">{{ campaign.description }}</p>
        <p class="card-text status">
          Created By: {{ campaign.createdBy.name }} <br />
          Donors:
          <span v-for="(donor, index) in campaign.donors" :key="index">
            {{ donor.name }}
            <span v-if="index !== campaign.donors.length - 1">, </span> </span
          ><br />
          Goal: {{ campaign.goal }} <br />
          Raised: {{ campaign.raisedAmount }} <br />
          Start Date: {{ formatDate(campaign.startDate) }} <br />
          End Date: {{ formatDate(campaign.endDate) }}
        </p>
        <button class="btn btn-primary" @click="refreshDonations()">
          Refresh
        </button>
        <button
          class="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target="#updateCampaignModal"
        >
          Update
        </button>
      </div>
      <div
        class="modal fade"
        id="updateCampaignModal"
        tabindex="-1"
        aria-labelledby="updateCampaignModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="updateCampaignModalLabel">
                Update user info here
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="update(campaign)" class="form">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    class="form-control"
                    v-model="campaign.name"
                    type="text"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label"
                    >Description</label
                  >
                  <textarea
                    class="form-control"
                    v-model="campaign.description"
                    type="text"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="goal" class="form-label">Goal</label>
                  <input
                    class="form-control"
                    v-model="campaign.goal"
                    type="number"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input
                    class="form-control"
                    v-model="campaign.startDate"
                    type="date"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="endDate" class="form-label">End Date</label>
                  <input
                    class="form-control"
                    v-model="campaign.endDate"
                    type="date"
                    required
                  />
                </div>
                <button
                  class="btn btn-primary"
                  type="submit"
                  data-bs-dismiss="modal"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useUserStore } from "../store/index";
export default {
  name: "ManageCampaigns",
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      campaigns: [],
    };
  },
  created() {
    fetch(`/api/campaigns/${this.user.chosenMosqueId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.campaigns = data;
        this.campaigns.forEach((campaign) => {
          campaign.startDate = campaign.startDate.substring(0, 10);
          campaign.endDate = campaign.endDate.substring(0, 10);
        });
      })
      .catch((err) => console.log(err));
  },
  methods: {
    addCampaign(){
      this.$router.push("/addCampaign");
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    refreshDonations() {
      window.location.reload();
    },
    update(campaign) {
      fetch(`/api/campaigns/${campaign._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: campaign.name,
          description: campaign.description,
          mosque: campaign.mosque,
          goal: campaign.goal,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert("Campaign updated successfully!");
            this.campaigns = data.campaigns;
            this.campaigns.forEach((campaign) => {
              campaign.startDate = campaign.startDate.substring(0, 10);
              campaign.endDate = campaign.endDate.substring(0, 10);
            });
            window.location.reload();
          } else {
            throw new Error(data.message || "Failed to update campaign");
          }
        })
        .catch((err) => {
          alert(`uh oh, theres a problem\n${err.status}: ${err.statusText}`);
        });
    },
  },
};
</script>
