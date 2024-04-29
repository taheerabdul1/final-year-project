<template>
  <div class="users-table">
    <h1>Admin Dashboard</h1>
    <p>
      You are administrator for the following mosque:
      {{ user.chosenMosqueName }}.
    </p>
    <h2>Users</h2>
    <p>
      The following users are registered to make donations to
      {{ user.chosenMosqueName }}.
    </p>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user._id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <h2>Donations</h2>
    <p>The following donations have been made to {{ user.chosenMosqueName }}</p>
    <div class="button-container">
      <button class="btn btn-success" @click="generateDonationsCSV()">
        Generate CSV Report
      </button>
      <button class="btn btn-danger" @click="generateDonationsPDF()">
        Generate PDF Report
      </button>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Donor Name</th>
            <th>Mosque</th>
            <th>Campaign</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donations" :key="donation._id">
            <td>{{ donation._id }}</td>
            <td>{{ donation.amount }}</td>
            <td>{{ donation.donor.name }}</td>
            <td>{{ donation.mosque.name }}</td>
            <td>
              {{ donation.campaign?.name || "No Campaign" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ManageCampaigns />
  <ManageAnnouncements />
</template>
<style>
.users-table {
  width: 80vw;
  margin: 0 auto;
}

.button-container {
  margin-bottom: 10px;
}

.button-container button {
  margin-right: 10px; 
}
</style>
<script>
import { useUserStore } from "../store/index";
import ManageCampaigns from "../components/ManageCampaigns.vue";
import ManageAnnouncements from "../components/ManageAnnouncements.vue";
export default {
  name: "AdminDashboard",
  components: {
    ManageCampaigns,
    ManageAnnouncements,
  },
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      users: [],
      mosque: [],
      donations: [],
    };
  },
  created() {
    // retrieve the list of users registered to this user's chosen mosque
    fetch(`/api/users/${this.user.chosenMosqueId}`)
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
    //  retrieve information about the donation for the user's chosen mosque
    fetch(`/api/mosqueAllDonations/${this.user.chosenMosqueId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        console.log(data);
        this.donations = data;
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    // make a request to generate a CSV file of the donations for the user's chosen mosque
    async generateDonationsCSV() {
      await fetch(`/api/reports/donations/csv/${this.user.chosenMosqueId}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "donations.csv";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
    // make a request to generate a PDF file of the donations for the user's chosen mosque
    async generateDonationsPDF() {
      await fetch(`/api/reports/donations/pdf/${this.user.chosenMosqueId}`)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "donations.pdf";
          a.click();
          window.URL.revokeObjectURL(url);
        });
    },
  },
};
</script>
