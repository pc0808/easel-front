<script setup lang="ts">
// import { usePostStore } from "@/stores/post";
import { onBeforeMount, ref } from "vue";
import router from "../router";
// import PostListComponent2 from "../components/Post/PostListComponent2.vue";
import ProfileComponent from "../components/Profile/ProfileComponent.vue";
import { useProfileStore } from "../stores/profile";

const {getProfile} = useProfileStore(); 
const username = router.currentRoute._value.params.user;
// const { getAuthorPosts} = usePostStore(); 
// let posts = ref<Array<Record<string, string>>>([]);

let loaded = ref(false); 
let profile = ref<Record<string, string>>();

onBeforeMount(async () => {
  profile = await getProfile(username); 
  // posts = await getAuthorPosts(currentUsername.value);  
  loaded.value = true; 
});

</script>

<template>
  <h1>Profile</h1>
  <section v-if="loaded">
    <ProfileComponent v-if="loaded" :profile="profile" />
    <!-- <PostListComponent2 v-if="loaded" :posts="posts" /> -->
  </section>
  <h1 v-else>Profile Not Found Yet</h1>
</template>
