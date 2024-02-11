<template>
  <div class="users-table">
    <h1>Admin Dashboard</h1>
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
    <h2>Mosques</h2>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mosque in mosques" :key="mosque._id">
            <td>{{ mosque._id }}</td>
            <td>{{ mosque.name }}</td>
            <td>{{ mosque.address }}</td>
            <td>{{ mosque.contact }}</td>
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
export default {
  name: "AdminDashboard",
  data() {
    return {
      users: [],
      mosques: [],
      donations: [],
    };
  },
  created() {
    fetch("http://localhost:3000/api/users")
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
    fetch("http://localhost:3000/api/mosques")
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
    fetch("http://localhost:3000/api/donations")
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
