<template>
  <h1>Announcements</h1>
  <h2 v-if="announcements.length == 0">Wow... so empty....</h2>
  <div v-for="announcement in announcements" :key="announcement._id">
    <div class="announcements-list">
      <div class="card mb-3">
      <div class="card-body">
        <h3 class="card-title">{{ announcement.title }}</h3>
        <p class="card-text">
          {{ formatDate(announcement.createdAt) }} by
          {{ announcement.createdBy.name }}
        </p>
        <p class="card-text">{{ announcement.content }}</p>
        <h5>Replies</h5>
        <div class="mt-3">
          <ReplyList
            :replies="announcement.replies"
            :announcementId="announcement._id"
          />
          <h4>Reply to this announcement here:</h4>
          <ReplyForm :announcementId="announcement._id" v-on:replySubmitted="handleReplySubmitted" />
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.announcements-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card {
  width: 100%;
  max-width: 600px;
  margin-bottom: 16px;
}

.card-body {
  padding: 16px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.status {
  font-size: 14px;
  margin-bottom: 16px;
}

button {
  margin-right: 8px;
}

@media screen and (max-width: 768px) {
  .card {
    width: 99%;
  }
}
</style>
<script>
import { useUserStore } from "../store/index";
import ReplyList from "../components/ReplyList.vue";
import ReplyForm from "../components/ReplyForm.vue";

export default {
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
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
    this.getAnnouncements();
  },
  methods: {
    getAnnouncements(){
      fetch(`/api/announcements/${this.user.chosenMosqueId}`)
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
    handleReplySubmitted(){
      this.getAnnouncements();
    }
  },
};
</script>
