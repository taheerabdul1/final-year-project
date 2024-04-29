<template>
  <h1>Add Announcement</h1>
  <form @submit.prevent="addAnnouncement(formData)" class="form">
    <div class="mb-3">
      <label for="description" class="form-label">Title</label>
      <input
        class="form-control"
        v-model="formData.title"
        type="text"
        required
      />
    </div>
    <div class="mb-3">
      <label for="title" class="form-label">Content</label>
      <textarea
        v-model="formData.content"
        rows="10"
        cols="30"
        placeholder="Content"
        required
      ></textarea>
    </div>
    <button class="btn btn-primary" type="submit">Update</button>
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
      formData: {
        title: "",
        content: "",
        mosque: this.user.chosenMosqueId,
      },
    };
  },
  methods: {
    // create a new announcement, then send the user to AnnouncementPage.vue
    addAnnouncement() {
      fetch(`/api/announcements`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Announcement added successfully");
            this.$router.push("/announcements");
          }
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>
