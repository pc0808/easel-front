<script setup lang="ts">
import { ref } from "vue";
import { useProfileStore } from "../../stores/profile";

const {getProfile} = useProfileStore(); 
const author = ref("");
const emit = defineEmits(["getProfileByUsername"]);

const DEFAULT_AVATAR = "../assets/images/defaultAvatar.png"; 

let username = "";
let biography = ""; 
let avatar = ""; 

async function search(){
  console.log("check:", author); 
  if(author.value){
    console.log("sending req for: ", author.value);
    const result = await getProfile(author.value); 
    
    username = author.value;
    biography = result.biography; 
    avatar = (result.avatar)? result.avatar: DEFAULT_AVATAR;  

    setTimeout(function() { }, 500); //half a second delay
  }
}
</script>

<template>
  <form @submit.prevent="search" class="pure-form">
    <fieldset>
      <legend>Search by Username</legend>
      <input id="author" type="text" v-model="author" placeholder="Username" />
      <button type="submit" class="pure-button" @onclick="search">Search</button>
    </fieldset>
  </form>
    <h3> {{ username }} </h3>
    <img :src=avatar>
    <span> {{ biography }}</span>
</template>

<style scoped>
form {
  display: flex;
  gap: 0.5em;
  padding: 1em;
  align-items: center;
}
img{
    height: 7em;
    width: 7em;
}
</style>
