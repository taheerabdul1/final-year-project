<template>
  <h2>Campaigns</h2>
  <h3>Create Campaign</h3>
  <p>
    To create a campaign,
    <button class="btn btn-primary" @click="addCampaign()">Click here</button>
  </p>
  <h3>View Campaigns</h3>
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
          @click="openModal(campaign)"
        >
          Update
        </button>
        <button class="btn btn-danger" @click="deleteCampaign(campaign)">
          Delete
        </button>
        <br />
        <button class="btn btn-success" @click="generateCampaignsCSV(campaign)">
          Generate .csv report
        </button>
        <button class="btn btn-danger" @click="generateCampaignsPDF(campaign)">
          Generate .pdf report
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
                Update campaign information
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="update(formData)" class="form">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    class="form-control"
                    v-model="formData.name"
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
                    v-model="formData.description"
                    type="text"
                    required
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="goal" class="form-label">Goal</label>
                  <input
                    class="form-control"
                    v-model="formData.goal"
                    type="number"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input
                    class="form-control"
                    v-model="formData.startDate"
                    type="date"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="endDate" class="form-label">End Date</label>
                  <input
                    class="form-control"
                    v-model="formData.endDate"
                    type="date"
                    required
                  />
                </div>
                <button
                  class="btn btn-primary"
                  type="submit"
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
      formData: {
        _id: "",
        name: "",
        description: "",
        mosque: "",
        goal: 0,
        startDate: "",
        endDate: "",
      }
    };
  },
  created() {
    // fetch the list of all campaigns on page load
    this.retrieveCampaigns();
  },
  methods: {
    // retrieve all the campaigns for the user's chosen mosque, then grab the dates and select only the first 10 characters
    retrieveCampaigns() {
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
    // redirect the user to AddCampaign.vue
    addCampaign() {
      this.$router.push("/addCampaign");
    },
    // format the date to a readable format
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    // retrieve fresh data
    refreshDonations() {
      this.retrieveCampaigns();
    },
    // update the announcement
    update(formData) {
      fetch(`/api/campaigns/${formData._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          mosque: formData.mosque,
          goal: formData.goal,
          startDate: formData.startDate,
          endDate: formData.endDate,
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
            this.retrieveCampaigns();
            document.querySelector(".btn-close").click();
          } else {
            throw new Error(data.message || "Failed to update campaign");
          }
        })
        .catch((err) => {
          alert(`uh oh, theres a problem\n${err.status}: ${err.statusText}`);
        });
    },
    // delete a specific campaign from the database
    deleteCampaign(campaign) {
      fetch(`/api/campaigns/${campaign._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert(data.error);
          } else {
            alert(data.message);
            this.retrieveCampaigns();
          }
        })
        .catch((error) => {
          alert(error.toString());
        });
    },
    // make a request to create a CSV report of the campaign
    async generateCampaignsCSV(campaign) {
      await fetch(`/api/reports/campaigns/csv/${campaign._id}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "campaign.csv";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    // make a request to create a PDF report of the campaign
    async generateCampaignsPDF(campaign) {
      await fetch(`/api/reports/campaigns/pdf/${campaign._id}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "campaign.pdf";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    openModal(campaign){
      this.formData = campaign;
    }
  },
};
</script>
<style scoped>
/* align the campaigns vertically in the centre of the page */
.campaign-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* the following selectors style each card */
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
  margin-bottom: 8px; 
}

/* make the card as wide as the screen on smaller screens */
@media screen and (max-width: 768px) {
  .card {
    width: 99%;
  }
}
</style>
