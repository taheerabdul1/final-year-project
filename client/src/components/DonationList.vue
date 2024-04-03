<template>
  <div class="donation-list">
    <h1>Recent Donations</h1>
    <table class="table">
      <thead>
        <tr>
          <th>Amount</th>
          <th>Donor</th>
          <th>Mosque</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="donation in donations" :key="donation._id">
          <td>{{ donation.amount }}</td>
          <td>{{ donation.donor.name }}</td>
          <td>{{ donation.mosque.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: "DonationList",
  data() {
    return {
      donations: [],
    };
  },
  created() {
    fetch(`/api/donations`) 
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then((data) => {
        this.donations = data;
        this.donations.reverse();
        this.donations = this.donations.slice(0, 3);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
<style scoped>
.donation-list {
  max-width: 80vw;
  margin: 0 auto;
  padding: 20px;
}
</style>
