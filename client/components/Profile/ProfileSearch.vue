<script setup lang="ts">
import { ref } from "vue";
import { useProfileStore } from "../../stores/profile";
import ProfileComponent from "./ProfileComponent.vue";

const {getProfile} = useProfileStore(); 
const author = ref("");


// let username = "";
// let biography = ""; 
// let avatar = ""; 
let loaded = ref(false); 
let profile = ref<Record<string, string>>();
// let isSelf = ref(false);
// let following = ref(false); 

async function search(){
  // console.log("check:", author); 
  loaded.value = false; 
  if(author.value){
    console.log("sending req for: ", author.value);
    profile = await getProfile(author.value); 
    loaded.value = true; 
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="search" class="profileBlock">
      <fieldset>
        <legend class="heading">Search by Username</legend>
        <input id="author" type="text" style="padding: 0.5em;" v-model="author" placeholder="Username" />
        <button type="submit" style="padding: 0.5em;" class="pure-button" @onclick="search">Search</button>
      </fieldset>
    </form>
    <ProfileComponent v-if="loaded" :profile="profile"/>
  </main>
</template>

<style scoped>
fieldset{
  border: none;
  padding: 0;
  margin: 0;
}
.profileInfo{
  float:right; 
  vertical-align: center;
  margin-left: 2em;
}
legend{
  text-transform: uppercase;
}
.heading {
  color: #ddd;
  font-family: century-gothic;
  letter-spacing: 1px;
  font-size: 25px;
  border: none;
  padding: 0;
  margin-bottom: 0.5em;
}
button{
  color: #ddd;
  margin-left: 2em;
}
</style>
