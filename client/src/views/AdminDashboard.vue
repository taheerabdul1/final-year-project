<template>
  <div class="users-table">
    <h1>Admin Dashboard</h1>
    <p>You are administrator for the following mosque:  {{mosque.name}}.</p>
    <p>The following users are registered to make donations to {{ mosque.name }}.</p>
    <h2>Users</h2>
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
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Donor Name</th>
            <th>Mosque</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="donation in donations" :key="donation._id">
            <td>{{ donation._id }}</td>
            <td>{{ donation.amount }}</td>
            <td>{{ donation.donor.name }}</td>
            <td>{{ donation.mosque.name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style>
.users-table {
  width: 80vw;
  margin: 0 auto;
  /* padding: 20px; */
}
</style>
<script>
import { useUserStore } from '../store/index';
export default {
  name: "AdminDashboard",
  setup() {
    const user = useUserStore();
    return {
      user,
    }
  },
  data() {
    return {
      users: [],
      mosque:[],
      donations: [],
    };
  },
  created() {
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
    fetch(`/api/mosques/${this.user.chosenMosqueId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.mosque = data;
      })
      .catch((error) => {
        console.error(error);
      });
      fetch(`/api/mosqueAllDonations/${this.user.chosenMosqueId}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          this.donations = data;
        })
        .catch((error) => {
          console.error(error);
        });
  },
};
</script>
