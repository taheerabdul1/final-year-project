<template>
  <h1>Donate</h1>
  <p>Fill in the form below to make a donation <br> We thank you for your generosity!</p>
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
      <label for="mosque">Mosque</label>
      <select
        id="mosque"
        name="mosque"
        v-model="mosque"
        class="form-control"
        required
      >
        <option value="" disabled selected>Click here to select a mosque</option>
        <option v-for="mosque in mosques" :key="mosque._id" :value="mosque._id">
          {{ mosque.name }}
        </option>
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
  data() {
    return {
      amount: "",
      donor: "",
      mosque: "",
      users: [],
      mosques: [],
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

    fetch("/api/mosques")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.mosques = data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  methods: {
    submitDonation() {
      const donation = {
        amount: this.amount,
        donor: this.user._id,
        mosque: this.mosque,
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
