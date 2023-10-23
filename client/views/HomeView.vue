<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
// import PostListComponent2 from "../components/Post/PostListComponent2.vue";
import CreatePost from "../components/Post/CreatePostForm.vue";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
      <CreatePost/>
    </section>
  </main>
</template>

<style scoped>
</style>
