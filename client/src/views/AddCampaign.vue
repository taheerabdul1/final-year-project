<template>
  <h1>Add Campaign</h1>
  <form @submit.prevent="addCampaign()" class="form">
    <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input class="form-control" v-model="name" type="text" required />
    </div>
    <div class="mb-3">
      <label for="description" class="form-label">Descrption</label>
      <textarea
        class="form-control"
        name="description"
        id="description"
        v-model="description"
        type="text"
      ></textarea>
    </div>
    <div class="mb-3">
      <label for="goal" class="form-label">Goal</label>
      <input class="form-control" v-model="goal" type="number" required />
    </div>
    <div class="mb-3">
      <label for="startDate" class="form-label">Start Date</label>
      <input class="form-control" v-model="startDate" type="date" required />
    </div>
    <div class="mb-3">
      <label for="endDate" class="form-label">End Date</label>
      <input class="form-control" v-model="endDate" type="date" required />
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>
<script>
import { useUserStore } from "../store/index";
export default {
  name: "ManageCampaigns",
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  data() {
    return {
      name: "",
      description: "",
      goal: "",
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    // create a new campaign, then redirect the user to CampaignsPage.vue
    addCampaign() {
      let formData = {
        name: this.name,
        mosque: this.user.chosenMosqueId,
        description: this.description,
        goal: this.goal,
        raisedAmount: 0,
        startDate: this.startDate,
        endDate: this.endDate,
        createdBy: this.user._id,
        donors: [],
      };
      fetch(`/api/campaigns`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Campaign added successfully.");
            this.$router.push("/campaigns");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
