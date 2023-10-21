<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import ProfileComponent from "../components/Profile/ProfileComponent.vue";
import { useProfileStore } from "../stores/profile";

const {getProfile} = useProfileStore(); 
const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false); 
let profile = ref<Record<string, string>>();

async function updateProfile() {
  profile = await getProfile(currentUsername.value); 
  loaded.value = true; 
  console.log(profile, loaded); 
  return profile
}

updateProfile(); 

</script>

<template>
  <h1>Profile</h1>
  <section v-if="loaded">
    <ProfileComponent :profile="profile" @refreshProfile="updateProfile"/>
    <ProfileSearch />
  </section>
  <h1 v-else>Profile Not Found Yet</h1>
</template>
