<template>
    <ul v-if="replies.length > 0" style="list-style-type: none;">
      <li v-for="reply in replies" :key="reply._id">
        <p>{{ reply.createdBy.name }} replied: {{ reply.content }}</p>
      </li>
    </ul>
  </template>
  
  <script>
  
  export default {
    props: ["replies", "announcementId"],
  };
  </script>
