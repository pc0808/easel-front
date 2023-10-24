<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import CreateBoardForm from "../components/Board/CreateBoardForm.vue";
import CreatePostForm from "../components/Post/CreatePostForm.vue";
import Dashboard from "../components/Post/Dashboard.vue";
// import PostListComponent2 from "../components/Post/PostListComponent2.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <CreatePostForm v-if="isLoggedIn"/>
      <CreateBoardForm v-if="isLoggedIn"/>
      <Dashboard v-if="isLoggedIn" />
    </section>
  </main>
</template>

<style scoped>
</style>
