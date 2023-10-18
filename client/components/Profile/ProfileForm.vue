<script setup lang="ts">
//import router from "@/router";
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
const DEFAULT_AVATAR = "../assets/images/defaultAvatar.png"; 

const { currentUsername } = storeToRefs(useUserStore()); 
const {updateProfile} = useProfileStore(); 
const { currAvatar, currBiography } = storeToRefs(useProfileStore()); 
let displayMode = ref(true); 

let imgSrc = (currAvatar.value)? currAvatar.value: DEFAULT_AVATAR;  //SETTING DEFAULT VALUES 
let avatar = currAvatar.value;
let biography = currBiography.value; 

async function update() {
  await updateProfile({ avatar, biography });
  imgSrc = currAvatar.value; 
  console.log("updated?", currAvatar.value, currBiography.value); 
  displayMode.value = true; 
}

function startEdit() { 
  displayMode.value = false;
  console.log(currAvatar.value, currBiography.value); 
  console.log("whoa", avatar, biography); 
}; 

</script>

<template>
  <div v-if="displayMode" :class="{ active: displayMode }" class = "view">
  <h2>Profile: </h2>
    <h3> {{ currentUsername }} </h3>
    <img :src=imgSrc>
    <span> {{ currBiography }}</span>
    <p></p>
    <button class="profileButton" v-on:click="startEdit()">
      Edit Profile
    </button>
  </div>
  <div v-else class="view" :class="{ active: !displayMode }">
    <form class="pure-form pure-form-aligned" @submit.prevent="update" >
      <h3>Update Profile</h3>
      <fieldset>
        <div class="pure-control-group">
          <label for="aligned-avatar">Avatar</label>
          <input v-model.trim="avatar" type="text" id="aligned-avatar" placeholder=currAvatar />
        </div>
        <div class="pure-control-group">
          <label for="aligned-bio">Biography</label>
          <input type="biography" v-model.trim="biography" id="aligned-bio" placeholder=currBiography />
        </div>
        <div class="pure-controls">
          <button type="submit" class="profileButton">Submit</button>
        </div>
      </fieldset>
    </form>
  </div>
  
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
  text-align: center;
}
.profileButton{
  background: none;
  border: solid 1px #ddd;
  font-size: medium;
  padding: 5% 10%;
  color: #ddd;
  font-family: century-gothic;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 0.5em;
  margin: 0 -10%;
  text-align: center;
}

.profileButton:hover{
  font-weight: bold;
  color: #191919;
  background-color: aqua;
  border-color: aqua;
}

.active{
  display: block;
}

view{
  display: none;
}

img{
  width: 7em;
  height: 7em;
}

</style>
