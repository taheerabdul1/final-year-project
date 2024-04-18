<template>
    <h1>Announcements</h1>
    <div v-for="announcement in announcements" :key="announcement._id">
      <div class="card mb-3">
        <div class="card-body">
          <h3 class="card-title">{{ announcement.title }}</h3>
          <p class="card-text">{{ formatDate(announcement.createdAt) }} by {{ announcement.createdBy.name }}</p>
          <div class="mt-3">
            <ReplyList :replies="announcement.replies" :announcementId="announcement._id" />
            <h4>Reply to this announcement here:</h4>
            <ReplyForm :announcementId="announcement._id" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import ReplyList from "../components/ReplyList.vue";
import ReplyForm from "../components/ReplyForm.vue";

export default {
  components: {
    ReplyList,
    ReplyForm,
  },
  data() {
    return {
      announcements: [],
    };
  },
  created() {
    fetch("/api/announcements")
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
  methods: {
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
