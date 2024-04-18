<template>
  <h1>Profile</h1>
  <p>
    Below are the details stored by FundMosque for this account. <br />
    Click the update button to update your details
  </p>
  <h5>Name: {{ user.name }}</h5>
  <h5>Username: {{ user.username }}</h5>
  <h5>Email: {{ user.email }}</h5>
  <h5>Chosen Mosque: {{ user.chosenMosqueName }}</h5>
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Update
  </button>
  <h2>Your donation history</h2>
  <div class="donation-table" v-if="donations.length > 0">
    <table class="table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Mosque</th>
          <th>Campaign</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="donation in donations" :key="donation._id">
          <td>{{ donation.amount }}</td>
          <td>{{ donation.mosque.name }}</td>
          <td>{{ donation.campaign?.name || null }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Update user information
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="update(user._id)" class="register-form">
            <div class="mb-3">
              <label for="username" class="form-label"
                >Username (cannot be changed)</label
              >
              <input
                class="form-control"
                v-model="user.username"
                type="text"
                disabled
                required
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Full Name</label>
              <input
                class="form-control"
                v-model="user.name"
                type="text"
                required
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                class="form-control"
                v-model="user.email"
                type="email"
                required
              />
            </div>
            <div class="mb-3">
              <label for="chosenMosqueId">Choose your preferred Mosque</label>
              <select
                id="chosenMosqueId"
                name="chosenMosqueId"
                v-model="user.chosenMosqueId"
                class="form-control"
                required
              >
                <option value="" disabled selected>
                  Click here to select a mosque
                </option>
                <option
                  v-for="mosque in mosques"
                  :key="mosque._id"
                  :value="mosque._id"
                >
                  {{ mosque.name }}
                </option>
              </select>
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
</template>
<style>
.donation-table {
  margin-right: 25%;
  margin-left: 25%;
  width: 50%;
}
</style>

<script>
import { useUserStore } from "../store/index";

export default {
  name: "ProfilePage",
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      mosques: [],
      donations: [],
    };
  },
  created() {
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
    fetch(`/api/userDonations/${this.user._id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        this.donations = data;
      });
  },
  methods: {
    async update(id) {
      let updatedUser = {
        _id: this.user._id,
        username: this.user.username,
        name: this.user.name,
        email: this.user.email,
        isAdmin: this.user.isAdmin,
        chosenMosqueId: this.user.chosenMosqueId,
      };
      await fetch(`/api/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedUser }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert("User updated successfully!");
            this.user.loggedIn();
            this.$router.push("/");
          } else {
            throw new Error(data.message || "Failed to update user");
          }
        })
        .catch((err) => {
          alert(`uh oh, theres a problem\n${err.status}: ${err.statusText}`);
        });
    },
  },
};
</script>
