<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import ProfileForm from "./ProfileForm.vue";

const props = defineProps(["profile"]);
const emit = defineEmits(["updateProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());

const biography = props.profile.biography; 
let loaded = ref(false);  
let followText = ref("");
let isSelf = ref((props.profile.username === currentUsername.value)? true: false); 

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
  console.log("on before mount");
  if(isSelf) return;
  const url = "/api/following/"+currentUsername.value+"&"+props.profile.username; 
  const result = await fetchy(url, "PATCH", {} ); 
  console.log(result); 
  // followText.value = (result.followUser2)? "Unfollow": "Follow"; 
  // loaded.value = true; 
});

async function followUnfollow() {
  
}


</script>

<template>
  <section class="profileBlock">
    <img :src=props.profile.avatar class="avatar" style="float:left">
    <span class ="profileInfo">
      <span class="username">{{ props.profile.username }}</span>
      <p>{{ props.profile.biography }}</p>
      <button v-if="isSelf"
       v-on:click="switchEdit()" id="editButton">Edit</button>
      <button v-if="loaded && !isSelf" 
      v-on:click="followUnfollow()">{{followText.valueOf}}</button>
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
</style>
