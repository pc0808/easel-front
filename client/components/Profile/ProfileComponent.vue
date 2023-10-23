<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ProfileForm from "./ProfileForm.vue";

const props = defineProps(["profile"]);
const username = props.profile.username; 
const emit = defineEmits(["updateProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());

const biography = props.profile.biography; 
let loaded = ref(false);  
let followText = ref("");
let isSelf = ref((props.profile.username === currentUsername.value)? true: false); 

// OF THE PROFILE, NOT OF THE CURR USER
let following = ref<Array<Record<string, string>>>([]);
let followers = ref<Array<Record<string, string>>>([]); 

function switchEdit() {
  const form = document.getElementById("editForm");
  const button = document.getElementById("editButton");
  
  if(form && button) {
    if(form.style.display === "block"){
      form.style.display = "none";
      button.innerText = "Edit";
    }
    else{
      form.style.display = "block" 
      button.innerText = "Cancel";
    } 
  }
}

onBeforeMount(async () => {
  let url;
  if(!isSelf.value){
    console.log("should not be here");
     //checks whether follow each other 
    url = "/api/following/"+currentUsername.value+"&"+props.profile.username; 
    const result = await fetchy(url, "PATCH", {} ); 
    followText.value = (result.followUser2)? "Unfollow": "Follow"; 
  }

  console.log("trying to get loaded", username);
  //get following+followed 
  url = "/api/following/"+username;
  following.value = (await fetchy(url, "GET")).users; 
  url = "/api/followers/"+username; 
  followers.value = (await fetchy(url, "GET")).users;
  loaded.value = true; 
});

async function followUnfollow() {
  if(followText.value === "Follow"){ //follows the user 
    followText.value = "Loading..."; //wait for stuff 

    const url = "/api/follow/"+props.profile.username; 
    const inst = await fetchy(url, "POST", {} ); 
    followers.value.push(inst); 

    console.log("after follow: ", followers.value); 
    followText.value = "Unfollow";
  } else{ //unfollows user
    followText.value = "Loading..."; //wait for stuff 

    const url = "/api/unfollow/"+props.profile.username; 
    await fetchy(url, "POST", {} ); 
    followers.value = (await fetchy("/api/followers/"+props.profile.username, "GET")).users; 

    console.log("after unfollow: ", followers.value); 
    followText.value = "Follow"; 
  }
}


</script>

<template>
  <section class="profileBlock">
    <img :src=props.profile.avatar class="avatar" style="float:left">
    <span class ="profileInfo">
      <span class="username">{{ props.profile.username }}</span>
      <p>{{ props.profile.biography }}</p>

      <span v-if="loaded">
        <a class="follow" v-if="loaded">{{following.length}} following </a>• 
        <a class="follow" v-if="loaded">{{followers.length}} followers </a>
      </span>
      <span v-else>Loading...</span>

      <button v-if="isSelf"
       v-on:click="switchEdit()" id="editButton">Edit</button>
      <button v-if="loaded && !isSelf" style="margin-top: 1em;"
      v-on:click="followUnfollow()">{{followText}}</button>
    </span>
  </section>

  <section id="editForm" v-if="props.profile.username == currentUsername" > 
    <ProfileForm :currBiography="biography" />
  </section>
</template>

<style scoped>
p {
  margin: 0em;
}

#editForm{
  display: none;
  margin-top: 3em;
}
.username {
  color: #ddd;
  font-family: century-gothic;
  letter-spacing: 1px;
  font-size: 25px;
  border: none;
  padding: 0;
  margin-bottom: 1em;
}
.profileInfo{
  float:right; 
  vertical-align: center;
  margin-left: 2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#editButton{
  padding: 5px 8px;
  margin-top: 1em;
}
.base article:only-child {
  margin-left: auto;
}

.follow{
  color: aqua;
}
</style>
