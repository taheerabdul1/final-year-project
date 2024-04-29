<template>
  <div class="reply-form">
    <form @submit.prevent="submitReply()">
      <textarea v-model="replyContent" rows="3" cols="30"></textarea>
      <button class="btn btn-primary" type="submit">Reply</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ["announcementId", "parentReplyId"],
  data() {
    return {
      replyContent: "",
    };
  },
  methods: {
    submitReply() {
      fetch(`/api/replies/${this.announcementId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: this.replyContent }),
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log("Error:" + error);
        })
        .then((data) => {
          if (data.success) {
            this.$emit('replySubmitted')
            this.replyContent = "";
          }
        });
    },
  },
};
</script>

<style scoped>
.reply-form {
  margin-top: 1rem;
  padding-left: 1rem;
}
</style>
