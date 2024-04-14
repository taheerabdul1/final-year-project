<template>
  <h1>Donate to {{ chosenMosqueName }}</h1>
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
      chosenMosqueName: "",
    };
  },
  created() {
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

    fetch(`/api/mosques/${this.user.chosenMosque}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.chosenMosqueName = data.name;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    submitDonation() {
      const donation = {
        amount: this.amount,
        donor: this.user._id,
        mosque: this.user.chosenMosque,
      };

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
