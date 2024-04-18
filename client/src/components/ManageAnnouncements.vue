<template>
  <h2>Announcements</h2>
  <h3>Create Announcement</h3>
  <p>
    To create an announcement,
    <button class="btn btn-primary" @click="addAnnouncement()">
      Click here
    </button>
  </p>
  <h3>View Announcements</h3>
  <p>Below are the announcements for the mosque you are administrating</p>
  <div v-for="announcement in announcements" :key="announcement._id">
    <div class="card mb-3">
      <div class="card-body">
        <h3 class="card-title">{{ announcement.title }}</h3>
        <p class="card-text">
          {{ formatDate(announcement.createdAt) }} by
          {{ announcement.createdBy.name }}
        </p>
        <p class="card-text">{{ announcement.content }}</p>
        <button
          @click="showUpdateModal(announcement)"
          class="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target="#updateAnnouncementModal"
        >
          Update
        </button>
        <button
          class="btn btn-danger"
          @click="deleteAnnouncement(announcement)"
        >
          Delete
        </button>
      </div>
    </div>
    <div
      class="modal fade"
      id="updateAnnouncementModal"
      tabindex="-1"
      aria-labelledby="updateAnnouncementModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="updateAnnouncementModalLabel">
              Update announcement
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateAnnouncement(formData)" class="form">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      announcements: [],
      formData: {
        _id: 0,
        title: "",
        content: "",
      },
    };
  },
  created() {
    this.getAnnouncements();
  },
  methods: {
    async getAnnouncements() {
      await fetch("/api/announcements")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response.status);
          }
        })
        .then((data) => {
          if (data.success) {
            this.announcements = data.announcements;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    addAnnouncement() {
      this.$router.push("/addAnnouncement");
    },
    async updateAnnouncement(formData) {
      await fetch(`/api/announcements/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            alert("Announcement updated successfully!");
            this.getAnnouncements();
          } else {
            throw new Error(data.message || "Failed to update campaign");
          }
        })
        .catch((err) => {
          alert(`uh oh, theres a problem\n${err.status}: ${err.statusText}`);
        });
    },
    async deleteAnnouncement(announcement) {
      await fetch(`/api/announcements/${announcement._id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw response;
          }
        })
        .then((data) => {
          if (data.success) {
            alert("Announcement deleted successfully");
            this.getAnnouncements();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showUpdateModal(announcement) {
      this.formData = announcement;
    },
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(date).toLocaleString("en-US", options);
    },
  },
};
</script>
