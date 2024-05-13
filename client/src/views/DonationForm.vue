<template>
  <div v-if="user.chosenMosqueName != null">
    <h1>Donate to {{ user.chosenMosqueName }}</h1>
    <p>
      Fill in the form below to make a donation <br />
      We thank you for your generosity! <br />To change the mosque you wish to
      donate to, edit your profle.
    </p>
    <form @submit.prevent="redirectToCheckout()" method="POST">
      <div class="mb-3">
        <label for="amount">Amount</label>
        <input
          type="number"
          class="form-control"
          id="amount"
          name="amount"
          aria-describedby="amount"
          v-model="amount"
          placeholder="Enter Amount in £ here"
          required
        />
      </div>
      <div class="mb-3">
        <label for="campaign">Campaign</label>
        <select
          class="form-select"
          id="campaign"
          name="campaign"
          v-model="selectedCampaign"
        >
          <option value="" selected>None</option>
          <option
            v-for="campaign of campaigns"
            :key="campaign._id"
            :value="campaign._id"
          >
            {{ campaign.name }}
          </option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
  <div v-else>
    <h1>Uh Oh!</h1>
    <p>You don't have a chosen mosque!</p>
    <p>Go and select a chosen mosque from the profile page.</p>
  </div>
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
      campaigns: [],
      selectedCampaign: null,
    };
  },
  created() {
    // retrieve the list of campaigns for the user's chosen mosque
    fetch(`/api/campaigns/${this.user.chosenMosqueId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => (this.campaigns = data))
      .catch(() => console.log("Error"));
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      this.amount = this.$route.query.amount;
      this.selectedCampaign = this.$route.query.campaign;
      this.submitDonation();
    }
    if (query.get("canceled")) {
      alert("Donation canceled.");
    }
  },
  methods: {
    redirectToCheckout() {
      fetch("/api/donations/pay/checkout", {
        method: "POST",
        body: JSON.stringify({
          amount: this.amount,
          campaign: this.selectedCampaign,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          window.location.href = data.url;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    // make a donation, submit different object depending on whether campaign is selected or not
    // redirect the user back to HomePage.vue after successful submission
    submitDonation() {
      let donation = [];
      if (this.selectedCampaign === "" || null) {
        donation = {
          amount: this.amount,
          donor: this.user._id,
          mosque: this.user.chosenMosqueId,
        };
      } else {
        donation = {
          amount: this.amount,
          donor: this.user._id,
          mosque: this.user.chosenMosqueId,
          campaign: this.selectedCampaign,
        };
      }
      if (this.amount == "") {
        alert("Please enter an amount");
      } else {
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
          .then((data) => {
            if(data.success){
              alert("Donation successful");
              router.push("/");
            }
          })
          .catch((error) => {
            console.error(error);
            alert("Donation failed");
          });
      }
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
