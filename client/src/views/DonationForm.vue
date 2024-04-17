<template>
  <h1>Donate to {{ user.chosenMosqueName }}</h1>
  <p>Fill in the form below to make a donation <br> We thank you for your generosity!
  <br>To change the mosque you wish to donate to, edit your profle.</p>
  <form @submit.prevent="submitDonation">
    <div class="mb-3">
      <label for="amount">Amount</label>
      <input
        type="number"
        class="form-control"
        id="amount"
        aria-describedby="amount"
        v-model="amount"
        placeholder="Enter Amount in £ here"
      />
    </div>
    <div class="mb-3">
      <label for="campaign">Campaign</label>
      <select class="form-select" id="campaign" name="campaign" v-model="selectedCampaign">
        <option value="" selected>None</option>
        <option v-for="campaign of campaigns" :key="campaign._id" :value="campaign._id">{{ campaign.name }}</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
<script>
import router from "../router/index";
import { useUserStore } from "../store/index";

export default {
  name: "DonationForm",
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      amount: "",
      donor: "",
      mosque: "",
      users: [],
      campaigns: [],
      selectedCampaign: null,
      chosenMosqueName: "",
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
      .then((data) => this.campaigns = data)
      .catch(() => console.log("Error")); 
    fetch("/api/users")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.users = data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    submitDonation() {
      let donation = [];
      if (this.selectedCampaign===""){
        donation = {
        amount: this.amount,
        donor: this.user._id,
        mosque: this.user.chosenMosqueId,
      }
      } else { 
        donation = {
        amount: this.amount,
        donor: this.user._id,
        mosque: this.user.chosenMosqueId,
        campaign: this.selectedCampaign,
      }
    }
      console.log(donation);
      fetch("/api/donations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(donation),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then(() => {
          alert("Donation successful");
          router.push("/");
        })
        .catch((error) => {
          console.error(error);
          alert("Donation failed");
        });
    },
  },
};
</script>
<style>
/* Style the form */
form {
  margin: auto;
  width: 300px;
  padding: 20px;
  border: 1px solid #f1f1f1;
}
</style>
