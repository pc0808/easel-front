<script setup lang="ts">
import { useBoardStore } from "@/stores/board";
import { usePostStore } from "@/stores/post";
import { onBeforeMount, ref } from "vue";
import ProfileComponent from "../components/Profile/ProfileComponent.vue";
import router from "../router";
import { useProfileStore } from "../stores/profile";

const {getProfile} = useProfileStore(); 
const { getAuthorPosts} = usePostStore(); 
const { getAuthorBoards } = useBoardStore();
const username = router.currentRoute.value.params.user;

let loaded = ref(false); 
let profile = ref<Record<string, string>>();

onBeforeMount(async () => {
  profile.value = await getProfile(username);
  loaded.value = true; 
});

</script>

<template>
  <h1>Profile</h1>
  <section v-if="loaded">
    <ProfileComponent v-if="loaded" :profile="profile" />
    <section class="profileLink">
      <span class="heading">See Posts</span><RouterLink class="routerLink"
      :to="{name: 'PostList', params: {user: username }}"> >> </RouterLink>
    </section>
    <section class="profileLink">
      <span class="heading">See Boards</span><RouterLink class="routerLink"
      :to="{name: 'BoardList', params: {user: username }}"> >> </RouterLink>
    </section>
  </section>
  <h1 v-else>Profile Not Found Yet</h1>
</template>
<style scoped>
.profileLink{
  margin: 5% 20%;
  border-bottom: solid 2px #ddd;
  padding-bottom: 1em;
}
</style>
