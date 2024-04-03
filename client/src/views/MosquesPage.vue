<template>
  <div class="mosque-list">
    <h1>Mosques</h1>
    <p>
      Below are the mosques registered with FundMosque.<br />
      Click More Info to find out more
    </p>
    <table class="table">
      <thead>
        <tr>
          <th>Mosque Name</th>
          <th>Mosque Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mosque in mosques" :key="mosque._id">
          <td>{{ mosque.name }}</td>
          <td>{{ mosque.address }}</td>
          <td>
            <button
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              v-on:click="mosqueMoreInfo(mosque._id, mosque.name)"
            >
              More Info
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">More information about: </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h2>{{ this.selectedMosque }}</h2>
          <p>The total donations since joining FundMosque for {{ selectedMosque }} is: £{{ totalMosqueDonations }}!</p>
          <table class="table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Donor</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="mosqueDonation in mosqueDonations"
                :key="mosqueDonation._id"
              >
                <td>{{ mosqueDonation.amount }}</td>
                <td>{{ mosqueDonation.donor.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MosquesPage",
  data() {
    return {
      mosques: [],
      selectedMosque: "",
      mosqueDonations: [],
      totalMosqueDonations: 0,
    };
  },
  mounted() {
    fetch(`/api/mosques/`)
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
  methods: {
    mosqueMoreInfo(id, name) {
      this.selectedMosque = name;
      fetch(`/api/mosqueAllDonations/${id}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          this.mosqueDonations = data;
          this.totalMosqueDonations = 0;
          for (let i = 0; i < this.mosqueDonations.length; i++) {
            this.totalMosqueDonations += this.mosqueDonations[i].amount;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
<style>
.mosque-list {
  max-width: 80vw;
  margin: 0 auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  vertical-align: middle;
}
</style>
