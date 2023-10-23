<script setup lang="ts">
import { usePostStore } from "@/stores/post";
import { onBeforeMount, ref } from "vue";
import ProfileComponent from "../components/Profile/ProfileComponent.vue";
import router from "../router";
import { useProfileStore } from "../stores/profile";

const {getProfile} = useProfileStore(); 
const { getAuthorPosts} = usePostStore(); 
const username = router.currentRoute._value.params.user;
let posts = ref<Array<Record<string, string>>>([]);

let loaded = ref(false); 
let profile = ref<Record<string, string>>();

onBeforeMount(async () => {
  profile = await getProfile(username); 
  posts = await getAuthorPosts(username);  
  for(const post in posts) {
    posts[post].profile = profile; 
  }
  loaded.value = true; 
});

</script>

<template>
  <h1>Profile</h1>
  <section v-if="loaded">
    <ProfileComponent v-if="loaded" :profile="profile" />
    <section class="postsProfile">
      <span class="heading">See Posts</span><RouterLink class="routerLink"
      :to="{name: 'PostList', params: {user: username }}"> >> </RouterLink>
    </section>
  </section>
  <h1 v-else>Profile Not Found Yet</h1>
</template>
<style scoped>
.postsProfile{
  margin: 5% 20%;
  border-bottom: solid 2px #ddd;
  padding-bottom: 1em;
}
</style>
