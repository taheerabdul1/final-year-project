<template>
    <div id="div">
      <h1>{{ donationStatus }}</h1>
      <p id="message">{{ donationMessage }}</p>
      <button class="btn btn-primary" @click="goToHomePage()">Go Home</button>
    </div>
  </template>
  <script>
  import router from "../router/index"
  import { useUserStore } from "../store/index";
  export default {
    name: "DonationSuccess",
    setup() {
      const user = useUserStore();
      return { user };
    },
    data() {
      return {
        amount: "",
        donor: "",
        mosque: "",
        selectedCampaign: null,
        donationStatus: "Donation Status",
        donationMessage: "Donation is processing...",
      };
    },
    created() {
      const query = new URLSearchParams(window.location.search);
      if (query.get("amount")) {
        this.amount = this.$route.query.amount;
      }
      if (query.get("campaign")) {
        if (!this.$route.query.campaign == "null") {
          this.selectedCampaign = this.$route.query.campaign;
        }
      }
      if (query.get("session_id")) {
        this.checkDonation(this.$route.query.session_id);
      }
    },
    methods: {
      goToHomePage(){
        router.push("/");
      },
      checkDonation(session_id) {
        fetch(`/api/donations/pay/checkout?session_id=${session_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response.status);
            }
          })
          .then((data) => {
            this.donationMessage = data.message;
            if (data.session.status == "complete") {
              this.donationStatus = "Donation Successful";
              this.donationMessage = "Donation was made successfully!";
              this.submitDonation();
            } else if (!data.success) {
              this.donationStatus = "Donation Failed";
              this.donationMessage = "Donation is not valid! Try Again.";
            }
          });
      },
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
              if (data.success) {
                this.donationMessage="Database updated successfully!"
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
  